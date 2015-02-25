/// <reference path="../model/ClientErrorsModel.ts" />
/// <reference path="../data/MongoRepositoryBase.ts" />
/// <reference path="../data/IRepository.ts" />
/// <reference path="../data/IIdentifierRepository.ts" />

'use strict';
import Base = require('../data/MongoRepositoryBase');
import Contract = require('../data/IRepository');
import Repository = require('../data/IdentifierRepository');
import ErrorsModel = require('../model/ClientErrorsModel');
import ConfigServer = require('../config/Config');

export module Data {
    export class MongoRepository<T> extends Base.Data.MongoRepositoryBase implements Contract.Data.IRepository<T> {
        constructor(collectionName:string) {
            super(collectionName);
        }

        //Read
        public FindById(id:any, requestContext:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var repository = this;
            var collectionName:string = this.CollectionName;
            var idNum:number = parseInt(id);

            this.DoCollectionOperation(collectionName, function (collection, err) {
                if (err) {
                    console.log('Error finding record ' + collectionName + ' with id ' + id + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                }
                else collection.findOne({'Id': idNum, 'Deleted': false}, function (err, item) {
                    var hasError = err || !item;
                    var logMessage = hasError ?
                    'Error finding record ' + collectionName + ' with id ' + id + '\n' + err :
                    'Retrieved ' + collectionName + ' with id ' + id;

                    console.log(logMessage);
                    var returnedItem = hasError ? null : item;
                    var returnedError = hasError ? ErrorsModel.Model.ClientErrorsModel.CreateWithError('FindByIdError', [id, collectionName]) : null;

                    repository.CloseClientWithCallback(function () {
                        callback(returnedItem, returnedError);
                    });
                });
            });
        }

        public FindByCondition(condition:any, requestContext:any, callback:(data:T[], errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            this.FindByConditionAndProject(condition, {}, requestContext, callback);
        }

        public FindByConditionAndProject(condition:any, projector:any, requestContext:any, callback:(data:T[], errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var repository = this;
            var collectionName = this.CollectionName;

            this.DoCollectionOperation(collectionName, function (collection, err) {
                var collectionQuery = JSON.parse(JSON.stringify(condition));
                collectionQuery['Deleted'] = false;
                if (err) {
                    console.log('Error finding records from ' + collectionName + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                }
                else collection.find(collectionQuery, projector)
                    .sort('ModifiedDate', -1)
                    .toArray(function (err, items) {
                        var logMessage = err ?
                        'Error finding records from ' + collectionName + '\n' + err :
                        'Retrieved ' + (projector ? 'projected ' : '') + collectionName + ' matching condition ' + JSON.stringify(condition) + '. Total records count ' + items.length;

                        console.log(logMessage);
                        var returnedItems = err ? null : items;
                        var returnedError = err ? ErrorsModel.Model.ClientErrorsModel.CreateWithError('FindMultipleError', [collectionName]) : null;

                        repository.CloseClientWithCallback(function () {
                            callback(returnedItems, returnedError);
                        });
                    });
            });
        }

        public FindPaged(query:any, page:number, size:number, requestContext:any, callback:(pagedData:any, errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var repository = this;
            var collectionName = this.CollectionName;

            // Start ->| ... prev. page ... | ... curr. page ... | ... nex. page ... |<- End
            var start = page == 0 ? page * size : (page - 1) * size;
            var end = (page + 2) * size;
            var total = end - start;

            this.DoCollectionOperation(collectionName, function (collection, err) {
                var collectionQuery = JSON.parse(JSON.stringify(query));
                collectionQuery['Deleted'] = false;
                if (err) {
                    console.log('Error finding records from ' + collectionName + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                }
                //Items
                else collection.find(collectionQuery)
                    .sort('ModifiedDate', -1)
                    .skip(start).limit(total)
                    .toArray(function (err, items) {
                        var logMessage = err ?
                        'Error finding records from ' + collectionName + '\n' + err :
                        'Retrieved page ' + page + ' from ' + collectionName + ' matching condition ' + JSON.stringify(query) + '. Total records count ' + items.length;

                        console.log(logMessage);
                        if (err || items == null) {
                            var errorModel = ErrorsModel.Model.ClientErrorsModel.CreateWithError('FindPagedError', [collectionName, page.toString()]);
                            repository.CloseClientWithCallback(function () {
                                callback(null, errorModel);
                            });
                            return;
                        }

                        //Total count and collection version identifier
                        collection
                            .aggregate(repository.GetCollectionInfoAggregationObject(collectionQuery), function (err, agg) {
                                if (err || agg == null) {
                                    console.log(err);
                                    var errorModel = ErrorsModel.Model.ClientErrorsModel.CreateWithError('FindPagedError', [collectionName, page.toString()]);
                                    repository.CloseClientWithCallback(function () {
                                        callback(null, errorModel);
                                    });
                                }
                                else {
                                    var count = agg.length == 1 ? agg[0].Count : 0;
                                    var versionId = agg.length == 1 ? agg[0].LastModified : (new Date()).getTime();

                                    //Create model
                                    //data = { EntitySystemName, Page: { PageIndex, TotalCount, TotalPages, StartIndex, LoadedCount, VersionIdentifier }, List : [] }
                                    var data = {
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

                                    repository.CloseClientWithCallback(function () {
                                        callback(data, null);
                                    });
                                }
                            });
                    });
            });
        }

        //Create
        public Create(data:T, requestContext:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel)=> void):void {
            var repository = this;
            var collectionName = this.CollectionName;

            var IdentifierRepository = new Repository.Data.IdentifierRepository();
            IdentifierRepository.GetNewIdentifierFor(collectionName, data, function (id, err) {
                if (err || !id) callback(null, err);
                else data['Id'] = id;

                repository.DoCollectionOperation(collectionName, function (collection, err) {
                    var now = (new Date()).getTime();

                    //Set additional properties
                    data['CreatedDate'] = now;
                    data['CreateBy'] = requestContext.user;
                    data['ModifiedDate'] = now;
                    data['ModifiedBy'] = requestContext.user;
                    data["Deleted"] = false;

                    if (err) {
                        console.log('Error creating new record with id ' + id + ' in collection ' + collectionName + '\n' + err);
                        callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                    }
                    else collection.insert(data, {w: 1}, function (err, result) {
                        var logMessage = err ?
                        'Error creating new record with id ' + id + ' in collection ' + collectionName + '\n' + err :
                        'Created new record with id ' + id + ' in collection ' + collectionName;

                        console.log(logMessage);
                        var itemizedResult = result.length == 1 ? result[0] : result;
                        var returnedItem = err ? null : itemizedResult;
                        var returnedError = err ? ErrorsModel.Model.ClientErrorsModel.CreateWithError('CreateNewError', [collectionName]) : null;

                        repository.CloseClientWithCallback(function () {
                            callback(returnedItem, returnedError);
                            if (!err) repository.LogOperationAsync(requestContext, collectionName, id, 'create', null, null);
                        });
                    });
                });
            });
        }

        public CreateMultiple(data:T[], requestContext:any, callback:(data:T[], errors:ErrorsModel.Model.ClientErrorsModel)=> void):void {
            throw new Error();
        }

        //Update
        public Update(data:T, requestContext:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel)=> void):void {
            var repository = this;
            var collectionName = this.CollectionName;

            repository.DoCollectionOperation(collectionName, function (collection, err) {
                var id = data['Id'];
                var now = (new Date()).getTime();
                var modified = data['ModifiedDate'];
                data['ModifiedDate'] = now;
                data['ModifiedBy'] = requestContext.user;

                var setter = {
                    $set: {
                        Data: data['Data'],
                        Fields: data['Fields'],
                        ModifiedDate: now,
                        ModifiedBy: requestContext.user
                    }
                };
                var recordQuery = ConfigServer.Config.Server.UseOptimisticConcurrencyUpdate ?
                {"Id": id, "Deleted": false, "ModifiedDate": modified} :
                {"Id": id, "Deleted": false};

                if (err) {
                    console.log('Error updating record with id ' + id + ' from ' + collectionName + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                }
                else collection.update(recordQuery, setter, {w: 1}, function (err, result) {
                    var logMessage = err ?
                    'Error updating record with id ' + id + ' from ' + collectionName + '\n' + err :
                        (result == 0 ?
                        'Could not update record with id ' + id + ' from ' + collectionName + '. No record found, or concurrency error' :
                        'Updated record with id ' + id + ' in collection ' + collectionName);

                    console.log(logMessage);
                    var returnedItem = err ? null : data;
                    var returnedError = (err || result == 0) ?
                        ErrorsModel.Model.ClientErrorsModel.CreateWithError('UpdateExistingError', [collectionName]) :
                        null;

                    repository.CloseClientWithCallback(function () {
                        callback(returnedItem, returnedError);
                        if (!err) repository.LogOperationAsync(requestContext, collectionName, id, 'update', null, null);
                    });
                });
            });
        }

        //Delete
        public Delete(idStr:string, requestContext:any, callback:(success:boolean, errors:ErrorsModel.Model.ClientErrorsModel)=> void):void {
            var repository = this;
            var collectionName = this.CollectionName;
            var idNum:number = parseInt(idStr);

            repository.DoCollectionOperation(collectionName, function (collection, err) {
                var now = (new Date()).getTime();
                var setter = {
                    $set: {
                        Deleted: true,
                        ModifiedDate: now,
                        ModifiedBy: requestContext.user
                    }
                };
                var recordQuery = {"Id": idNum, "Deleted": false};

                if (err) {
                    console.log('Error deleting record with id ' + idStr + ' from ' + collectionName + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                }
                else collection.update(recordQuery, setter, {w: 1}, function (err, result) {
                    var logMessage = err ?
                    'Error deleting record with id ' + idStr + ' from ' + collectionName + '\n' + err :
                    'Deleted record with id ' + idStr + ' in collection ' + collectionName;

                    console.log(logMessage);
                    var returnedItem:boolean = err ? null : true;
                    var returnedError:ErrorsModel.Model.ClientErrorsModel = err ? ErrorsModel.Model.ClientErrorsModel.CreateWithError('UpdateExistingError', [collectionName]) : null;

                    repository.CloseClientWithCallback(function () {
                        callback(returnedItem, returnedError);
                        if (!err) repository.LogOperationAsync(requestContext, collectionName, idNum, 'delete', null, null);
                    });
                });
            });
        }
    }
}
