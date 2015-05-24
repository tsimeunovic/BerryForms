/// <reference path="../../model/ClientErrorsModel.ts" />
/// <reference path="MongoRepositoryBase.ts" />
/// <reference path="../common/IMongoRepository.ts" />
/// <reference path="../common/IIdentifierRepository.ts" />

import Base = require('../common/MongoRepositoryBase');
import Contract = require('../common/IMongoRepository');
import Repository = require('../common/IdentifierRepository');
import ErrorsModel = require('../../model/ClientErrorsModel');
import ConfigServer = require('../../config/Config');

export module Data {
    'use strict';

    /* tslint:disable:no-string-literal */
    export class MongoRepository<T> extends Base.Data.MongoRepositoryBase implements Contract.Data.IMongoRepository<T> {
        constructor(collectionName:string) {
            super(collectionName);
        }

        //Read
        public FindById(idStr:string, requestContext:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            var _this:MongoRepository<T> = this;
            var collectionName:string = this.CollectionName;
            var idNum:number = parseInt(idStr, 10);

            this.DoCollectionOperation(collectionName, function (collection:any, err:any):void {
                if (err) {
                    console.log('Error finding record ' + collectionName + ' with id ' + idStr + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                } else {
                    collection.findOne({'Id': idNum, 'Deleted': false}, function (err:any, item:any):void {
                        var hasError:boolean = err || !item;
                        var logMessage:string = hasError ?
                        'Error finding record ' + collectionName + ' with id ' + idStr + '\n' + err :
                        'Retrieved ' + collectionName + ' with id ' + idStr;

                        console.log(logMessage);
                        var returnedItem:any = hasError ?
                            null :
                            item;
                        var returnedError:ErrorsModel.Model.ClientErrorsModel = hasError ?
                            ErrorsModel.Model.ClientErrorsModel.CreateWithError('FindByIdError', [idStr, collectionName]) :
                            null;

                        _this.CloseClientWithCallback(function ():void {
                            callback(returnedItem, returnedError);
                        });
                    });
                }
            });
        }

        public FindByCondition(condition:any, requestContext:any, callback:(data:T[], errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            this.FindByConditionAndProject(condition, {}, requestContext, callback);
        }

        public FindByConditionAndProject(condition:any, projector:any, requestContext:any,
                                         callback:(data:T[], errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            var _this:MongoRepository<T> = this;
            var collectionName:string = this.CollectionName;

            this.DoCollectionOperation(collectionName, function (collection:any, err:any):void {
                var collectionQuery:any = JSON.parse(JSON.stringify(condition));
                collectionQuery.Deleted = false;
                if (err) {
                    console.log('Error finding records from ' + collectionName + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                } else {
                    collection.find(collectionQuery, projector)
                        .sort('ModifiedDate', -1)
                        .toArray(function (err:any, items:any[]):void {
                            var logMessage:string = err ?
                            'Error finding records from ' + collectionName + '\n' + err :
                            'Retrieved ' + (projector ? 'projected ' : '') + collectionName + ' matching condition ' +
                            JSON.stringify(condition) + '. Total records count ' + items.length;

                            console.log(logMessage);
                            var returnedItems:any[] = err ?
                                null :
                                items;
                            var returnedError:ErrorsModel.Model.ClientErrorsModel = err ?
                                ErrorsModel.Model.ClientErrorsModel.CreateWithError('FindMultipleError', [collectionName]) :
                                null;

                            _this.CloseClientWithCallback(function ():void {
                                callback(returnedItems, returnedError);
                            });
                        });
                }
            });
        }

        public FindPaged(query:any, page:number, size:number, requestContext:any,
                         callback:(pagedData:any, errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            var _this:MongoRepository<T> = this;
            var collectionName:string = this.CollectionName;

            // Start ->| ... prev. page ... | ... curr. page ... | ... nex. page ... |<- End
            var start:number = page === 0 ? page * size : (page - 1) * size;
            var end:number = (page + 2) * size;
            var total:number = end - start;

            this.DoCollectionOperation(collectionName, function (collection:any, err:any):void {
                var collectionQuery:any = JSON.parse(JSON.stringify(query));
                collectionQuery.Deleted = false;
                if (err) {
                    console.log('Error finding records from ' + collectionName + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                } else {
                    //Items
                    collection.find(collectionQuery)
                        .sort('ModifiedDate', -1)
                        .skip(start).limit(total)
                        .toArray(function (err:any, items:any[]):void {
                            var logMessage:string = err ?
                            'Error finding records from ' + collectionName + '\n' + err :
                            'Retrieved page ' + page + ' from ' + collectionName + ' matching condition ' +
                            JSON.stringify(query) + '. Total records count ' + items.length;

                            console.log(logMessage);
                            if (err || items === null) {
                                var errorModel:ErrorsModel.Model.ClientErrorsModel =
                                    ErrorsModel.Model.ClientErrorsModel.CreateWithError('FindPagedError', [collectionName, page.toString()]);
                                _this.CloseClientWithCallback(function ():void {
                                    callback(null, errorModel);
                                });
                                return;
                            }

                            //Total count and collection version identifier
                            collection
                                .aggregate(_this.GetCollectionInfoAggregationObject(collectionQuery), function (err:any, agg:any):void {
                                    if (err || agg === null) {
                                        console.log(err);
                                        var errorModel:ErrorsModel.Model.ClientErrorsModel =
                                            ErrorsModel.Model.ClientErrorsModel.CreateWithError('FindPagedError', [collectionName, page.toString()]);
                                        _this.CloseClientWithCallback(function ():void {
                                            callback(null, errorModel);
                                        });
                                    } else {
                                        var count:number = agg.length === 1 ? agg[0].Count : 0;
                                        var versionId:number = agg.length === 1 ? agg[0].LastModified : (new Date()).getTime();

                                        //Create model
                                        //data = { EntitySystemName,
                                        //          Page: { PageIndex, TotalCount, TotalPages, StartIndex, LoadedCount, VersionIdentifier },
                                        //          List : []
                                        //       }
                                        var data:any = {
                                            EntitySystemName: collectionName,
                                            Query: query,
                                            Page: {
                                                PageIndex: page,
                                                TotalCount: count,
                                                TotalPages: Math.ceil(count / size),
                                                StartIndex: start,
                                                LoadedCount: items.length,
                                                VersionIdentifier: versionId
                                            },
                                            List: items
                                        };

                                        _this.CloseClientWithCallback(function ():void {
                                            callback(data, null);
                                        });
                                    }
                                });
                        });
                }
            });
        }

        //Create
        public Create(data:T, requestContext:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            var _this:MongoRepository<T> = this;
            var collectionName:string = this.CollectionName;

            var identifierRepository:Repository.Data.IdentifierRepository = new Repository.Data.IdentifierRepository();
            identifierRepository.GetNewIdentifierFor(collectionName, data, function (id:number, err:any):void {
                if (err || !id) {
                    callback(null, err);
                } else {
                    data['Id'] = id;
                }

                _this.DoCollectionOperation(collectionName, function (collection:any, err:any):void {
                    var now:number = (new Date()).getTime();

                    //Set additional properties
                    data['CreatedDate'] = now;
                    data['CreateBy'] = requestContext.user;
                    data['ModifiedDate'] = now;
                    data['ModifiedBy'] = requestContext.user;
                    data['Deleted'] = false;

                    if (err) {
                        console.log('Error creating new record with id ' + id + ' in collection ' + collectionName + '\n' + err);
                        callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                    } else {
                        collection.insert(data, {w: 1}, function (err:any, result:any):void {
                            var logMessage:string = err ?
                            'Error creating new record with id ' + id + ' in collection ' + collectionName + '\n' + err :
                            'Created new record with id ' + id + ' in collection ' + collectionName;

                            console.log(logMessage);
                            var itemizedResult:any = result.length === 1 ?
                                result[0] :
                                result;
                            var returnedItem:any = err ?
                                null :
                                itemizedResult;
                            var returnedError:ErrorsModel.Model.ClientErrorsModel = err ?
                                ErrorsModel.Model.ClientErrorsModel.CreateWithError('CreateNewError', [collectionName]) :
                                null;

                            _this.CloseClientWithCallback(function ():void {
                                callback(returnedItem, returnedError);
                                if (!err) {
                                    _this.LogOperationAsync(requestContext, collectionName, id, 'create', null, null);
                                }
                            });
                        });
                    }
                });
            });
        }

        public CreateMultiple(data:T[], requestContext:any, callback:(data:T[], errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            throw new Error();
        }

        //Update
        public Update(data:T, requestContext:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            var _this:MongoRepository<T> = this;
            var collectionName:string = this.CollectionName;

            _this.DoCollectionOperation(collectionName, function (collection:any, err:any):void {
                var id:number = data['Id'];
                var now:number = (new Date()).getTime();
                var modified:number = data['ModifiedDate'];
                data['ModifiedDate'] = now;
                data['ModifiedBy'] = requestContext.user;

                var setter:any = {
                    $set: {
                        Data: data['Data'],
                        Fields: data['Fields'],
                        ModifiedDate: now,
                        ModifiedBy: requestContext.user
                    }
                };
                var recordQuery:any = ConfigServer.Config.Server.UseOptimisticConcurrencyUpdate ?
                {Id: id, Deleted: false, ModifiedDate: modified} :
                {Id: id, Deleted: false};

                if (err) {
                    console.log('Error updating record with id ' + id + ' from ' + collectionName + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                } else {
                    collection.update(recordQuery, setter, {w: 1}, function (err:any, result:number):void {
                        var logMessage:string = err ?
                        'Error updating record with id ' + id + ' from ' + collectionName + '\n' + err :
                            (result === 0 ?
                            'Could not update record with id ' + id + ' from ' + collectionName + '. No record found, or concurrency error' :
                            'Updated record with id ' + id + ' in collection ' + collectionName);

                        console.log(logMessage);
                        var returnedItem:any = err ? null : data;
                        var returnedError:ErrorsModel.Model.ClientErrorsModel = (err || result === 0) ?
                            ErrorsModel.Model.ClientErrorsModel.CreateWithError('UpdateExistingError', [collectionName]) :
                            null;

                        _this.CloseClientWithCallback(function ():void {
                            callback(returnedItem, returnedError);
                            if (!err) {
                                _this.LogOperationAsync(requestContext, collectionName, id, 'update', null, null);
                            }
                        });
                    });
                }
            });
        }

        //Delete
        public Delete(idStr:string, requestContext:any, callback:(success:boolean, errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            var _this:MongoRepository<T> = this;
            var collectionName:string = this.CollectionName;
            var idNum:number = parseInt(idStr, 10);

            _this.DoCollectionOperation(collectionName, function (collection:any, err:any):void {
                var now:number = (new Date()).getTime();
                var setter:any = {
                    $set: {
                        Deleted: true,
                        ModifiedDate: now,
                        ModifiedBy: requestContext.user
                    }
                };
                var recordQuery:any = {Id: idNum, Deleted: false};

                if (err) {
                    console.log('Error deleting record with id ' + idStr + ' from ' + collectionName + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                } else {
                    collection.update(recordQuery, setter, {w: 1}, function (err:any, result:number):void {
                        var logMessage:string = err ?
                        'Error deleting record with id ' + idStr + ' from ' + collectionName + '\n' + err :
                        'Deleted record with id ' + idStr + ' in collection ' + collectionName;

                        console.log(logMessage);
                        var returnedItem:boolean = err ?
                            null :
                            true;
                        var returnedError:ErrorsModel.Model.ClientErrorsModel = err ?
                            ErrorsModel.Model.ClientErrorsModel.CreateWithError('UpdateExistingError', [collectionName]) :
                            null;

                        _this.CloseClientWithCallback(function ():void {
                            callback(returnedItem, returnedError);
                            if (!err) {
                                _this.LogOperationAsync(requestContext, collectionName, idNum, 'delete', null, null);
                            }
                        });
                    });
                }
            });
        }
    }
}
