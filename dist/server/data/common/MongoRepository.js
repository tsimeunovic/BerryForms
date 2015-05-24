/// <reference path="../../model/ClientErrorsModel.ts" />
/// <reference path="MongoRepositoryBase.ts" />
/// <reference path="../common/IMongoRepository.ts" />
/// <reference path="../common/IIdentifierRepository.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Base = require('../common/MongoRepositoryBase');
var Repository = require('../common/IdentifierRepository');
var ErrorsModel = require('../../model/ClientErrorsModel');
var ConfigServer = require('../../config/Config');
var Data;
(function (Data) {
    'use strict';
    /* tslint:disable:no-string-literal */
    var MongoRepository = (function (_super) {
        __extends(MongoRepository, _super);
        function MongoRepository(collectionName) {
            _super.call(this, collectionName);
        }
        //Read
        MongoRepository.prototype.FindById = function (idStr, requestContext, callback) {
            var _this = this;
            var collectionName = this.CollectionName;
            var idNum = parseInt(idStr, 10);
            this.DoCollectionOperation(collectionName, function (collection, err) {
                if (err) {
                    console.log('Error finding record ' + collectionName + ' with id ' + idStr + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                }
                else {
                    collection.findOne({ 'Id': idNum, 'Deleted': false }, function (err, item) {
                        var hasError = err || !item;
                        var logMessage = hasError ?
                            'Error finding record ' + collectionName + ' with id ' + idStr + '\n' + err :
                            'Retrieved ' + collectionName + ' with id ' + idStr;
                        console.log(logMessage);
                        var returnedItem = hasError ?
                            null :
                            item;
                        var returnedError = hasError ?
                            ErrorsModel.Model.ClientErrorsModel.CreateWithError('FindByIdError', [idStr, collectionName]) :
                            null;
                        _this.CloseClientWithCallback(function () {
                            callback(returnedItem, returnedError);
                        });
                    });
                }
            });
        };
        MongoRepository.prototype.FindByCondition = function (condition, requestContext, callback) {
            this.FindByConditionAndProject(condition, {}, requestContext, callback);
        };
        MongoRepository.prototype.FindByConditionAndProject = function (condition, projector, requestContext, callback) {
            var _this = this;
            var collectionName = this.CollectionName;
            this.DoCollectionOperation(collectionName, function (collection, err) {
                var collectionQuery = JSON.parse(JSON.stringify(condition));
                collectionQuery.Deleted = false;
                if (err) {
                    console.log('Error finding records from ' + collectionName + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                }
                else {
                    collection.find(collectionQuery, projector)
                        .sort('ModifiedDate', -1)
                        .toArray(function (err, items) {
                        var logMessage = err ?
                            'Error finding records from ' + collectionName + '\n' + err :
                            'Retrieved ' + (projector ? 'projected ' : '') + collectionName + ' matching condition ' +
                                JSON.stringify(condition) + '. Total records count ' + items.length;
                        console.log(logMessage);
                        var returnedItems = err ?
                            null :
                            items;
                        var returnedError = err ?
                            ErrorsModel.Model.ClientErrorsModel.CreateWithError('FindMultipleError', [collectionName]) :
                            null;
                        _this.CloseClientWithCallback(function () {
                            callback(returnedItems, returnedError);
                        });
                    });
                }
            });
        };
        MongoRepository.prototype.FindPaged = function (query, page, size, requestContext, callback) {
            var _this = this;
            var collectionName = this.CollectionName;
            // Start ->| ... prev. page ... | ... curr. page ... | ... nex. page ... |<- End
            var start = page === 0 ? page * size : (page - 1) * size;
            var end = (page + 2) * size;
            var total = end - start;
            this.DoCollectionOperation(collectionName, function (collection, err) {
                var collectionQuery = JSON.parse(JSON.stringify(query));
                collectionQuery.Deleted = false;
                if (err) {
                    console.log('Error finding records from ' + collectionName + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                }
                else {
                    //Items
                    collection.find(collectionQuery)
                        .sort('ModifiedDate', -1)
                        .skip(start).limit(total)
                        .toArray(function (err, items) {
                        var logMessage = err ?
                            'Error finding records from ' + collectionName + '\n' + err :
                            'Retrieved page ' + page + ' from ' + collectionName + ' matching condition ' +
                                JSON.stringify(query) + '. Total records count ' + items.length;
                        console.log(logMessage);
                        if (err || items === null) {
                            var errorModel = ErrorsModel.Model.ClientErrorsModel.CreateWithError('FindPagedError', [collectionName, page.toString()]);
                            _this.CloseClientWithCallback(function () {
                                callback(null, errorModel);
                            });
                            return;
                        }
                        //Total count and collection version identifier
                        collection
                            .aggregate(_this.GetCollectionInfoAggregationObject(collectionQuery), function (err, agg) {
                            if (err || agg === null) {
                                console.log(err);
                                var errorModel = ErrorsModel.Model.ClientErrorsModel.CreateWithError('FindPagedError', [collectionName, page.toString()]);
                                _this.CloseClientWithCallback(function () {
                                    callback(null, errorModel);
                                });
                            }
                            else {
                                var count = agg.length === 1 ? agg[0].Count : 0;
                                var versionId = agg.length === 1 ? agg[0].LastModified : (new Date()).getTime();
                                //Create model
                                //data = { EntitySystemName,
                                //          Page: { PageIndex, TotalCount, TotalPages, StartIndex, LoadedCount, VersionIdentifier },
                                //          List : []
                                //       }
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
                                _this.CloseClientWithCallback(function () {
                                    callback(data, null);
                                });
                            }
                        });
                    });
                }
            });
        };
        //Create
        MongoRepository.prototype.Create = function (data, requestContext, callback) {
            var _this = this;
            var collectionName = this.CollectionName;
            var identifierRepository = new Repository.Data.IdentifierRepository();
            identifierRepository.GetNewIdentifierFor(collectionName, data, function (id, err) {
                if (err || !id) {
                    callback(null, err);
                }
                else {
                    data['Id'] = id;
                }
                _this.DoCollectionOperation(collectionName, function (collection, err) {
                    var now = (new Date()).getTime();
                    //Set additional properties
                    data['CreatedDate'] = now;
                    data['CreateBy'] = requestContext.user;
                    data['ModifiedDate'] = now;
                    data['ModifiedBy'] = requestContext.user;
                    data['Deleted'] = false;
                    if (err) {
                        console.log('Error creating new record with id ' + id + ' in collection ' + collectionName + '\n' + err);
                        callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                    }
                    else {
                        collection.insert(data, { w: 1 }, function (err, result) {
                            var logMessage = err ?
                                'Error creating new record with id ' + id + ' in collection ' + collectionName + '\n' + err :
                                'Created new record with id ' + id + ' in collection ' + collectionName;
                            console.log(logMessage);
                            var itemizedResult = result.length === 1 ?
                                result[0] :
                                result;
                            var returnedItem = err ?
                                null :
                                itemizedResult;
                            var returnedError = err ?
                                ErrorsModel.Model.ClientErrorsModel.CreateWithError('CreateNewError', [collectionName]) :
                                null;
                            _this.CloseClientWithCallback(function () {
                                callback(returnedItem, returnedError);
                                if (!err) {
                                    _this.LogOperationAsync(requestContext, collectionName, id, 'create', null, null);
                                }
                            });
                        });
                    }
                });
            });
        };
        MongoRepository.prototype.CreateMultiple = function (data, requestContext, callback) {
            throw new Error();
        };
        //Update
        MongoRepository.prototype.Update = function (data, requestContext, callback) {
            var _this = this;
            var collectionName = this.CollectionName;
            _this.DoCollectionOperation(collectionName, function (collection, err) {
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
                    { Id: id, Deleted: false, ModifiedDate: modified } :
                    { Id: id, Deleted: false };
                if (err) {
                    console.log('Error updating record with id ' + id + ' from ' + collectionName + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                }
                else {
                    collection.update(recordQuery, setter, { w: 1 }, function (err, result) {
                        var logMessage = err ?
                            'Error updating record with id ' + id + ' from ' + collectionName + '\n' + err :
                            (result === 0 ?
                                'Could not update record with id ' + id + ' from ' + collectionName + '. No record found, or concurrency error' :
                                'Updated record with id ' + id + ' in collection ' + collectionName);
                        console.log(logMessage);
                        var returnedItem = err ? null : data;
                        var returnedError = (err || result === 0) ?
                            ErrorsModel.Model.ClientErrorsModel.CreateWithError('UpdateExistingError', [collectionName]) :
                            null;
                        _this.CloseClientWithCallback(function () {
                            callback(returnedItem, returnedError);
                            if (!err) {
                                _this.LogOperationAsync(requestContext, collectionName, id, 'update', null, null);
                            }
                        });
                    });
                }
            });
        };
        //Delete
        MongoRepository.prototype.Delete = function (idStr, requestContext, callback) {
            var _this = this;
            var collectionName = this.CollectionName;
            var idNum = parseInt(idStr, 10);
            _this.DoCollectionOperation(collectionName, function (collection, err) {
                var now = (new Date()).getTime();
                var setter = {
                    $set: {
                        Deleted: true,
                        ModifiedDate: now,
                        ModifiedBy: requestContext.user
                    }
                };
                var recordQuery = { Id: idNum, Deleted: false };
                if (err) {
                    console.log('Error deleting record with id ' + idStr + ' from ' + collectionName + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                }
                else {
                    collection.update(recordQuery, setter, { w: 1 }, function (err, result) {
                        var logMessage = err ?
                            'Error deleting record with id ' + idStr + ' from ' + collectionName + '\n' + err :
                            'Deleted record with id ' + idStr + ' in collection ' + collectionName;
                        console.log(logMessage);
                        var returnedItem = err ?
                            null :
                            true;
                        var returnedError = err ?
                            ErrorsModel.Model.ClientErrorsModel.CreateWithError('UpdateExistingError', [collectionName]) :
                            null;
                        _this.CloseClientWithCallback(function () {
                            callback(returnedItem, returnedError);
                            if (!err) {
                                _this.LogOperationAsync(requestContext, collectionName, idNum, 'delete', null, null);
                            }
                        });
                    });
                }
            });
        };
        return MongoRepository;
    })(Base.Data.MongoRepositoryBase);
    Data.MongoRepository = MongoRepository;
})(Data = exports.Data || (exports.Data = {}));
//# sourceMappingURL=MongoRepository.js.map