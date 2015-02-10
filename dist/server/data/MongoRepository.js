/// <reference path="../model/ClientErrorsModel.ts" />
/// <reference path="../data/MongoRepositoryBase.ts" />
/// <reference path="../data/IRepository.ts" />
/// <reference path="../data/IIdentifierRepository.ts" />
'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Base = require('../data/MongoRepositoryBase');
var Repository = require('../data/IdentifierRepository');
var ErrorsModel = require('../model/ClientErrorsModel');
var ConfigServer = require('../config/Config');
var Data;
(function (Data) {
    var MongoRepository = (function (_super) {
        __extends(MongoRepository, _super);
        function MongoRepository(collectionName) {
            _super.call(this, collectionName);
        }
        //Read
        MongoRepository.prototype.FindById = function (id, callback) {
            var repository = this;
            var collectionName = this.CollectionName;
            var idNum = parseInt(id);
            this.DoCollectionOperation(collectionName, function (collection, err) {
                if (err) {
                    console.log('Error finding record ' + collectionName + ' with id ' + id + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                }
                else
                    collection.findOne({ 'Id': idNum }, function (err, item) {
                        var hasError = err || !item;
                        var logMessage = hasError ? 'Error finding record ' + collectionName + ' with id ' + id + '\n' + err : 'Retrieved ' + collectionName + ' with id ' + id;
                        console.log(logMessage);
                        var returnedItem = hasError ? null : item;
                        var returnedError = hasError ? ErrorsModel.Model.ClientErrorsModel.CreateWithError('FindByIdError', [id, collectionName]) : null;
                        repository.CloseClientWithCallback(function () {
                            callback(returnedItem, returnedError);
                        });
                    });
            });
        };
        MongoRepository.prototype.FindByCondition = function (condition, callback) {
            this.FindByConditionAndProject(condition, {}, callback);
        };
        MongoRepository.prototype.FindByConditionAndProject = function (condition, projector, callback) {
            var repository = this;
            var collectionName = this.CollectionName;
            this.DoCollectionOperation(collectionName, function (collection, err) {
                if (err) {
                    console.log('Error finding records from ' + collectionName + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                }
                else
                    collection.find(condition, projector).sort('ModifiedDate', -1).toArray(function (err, items) {
                        var logMessage = err ? 'Error finding records from ' + collectionName + '\n' + err : 'Retrieved ' + (projector ? 'projected ' : '') + collectionName + ' matching condition ' + JSON.stringify(condition) + '. Total records count ' + items.length;
                        console.log(logMessage);
                        var returnedItems = err ? null : items;
                        var returnedError = err ? ErrorsModel.Model.ClientErrorsModel.CreateWithError('FindMultipleError', [collectionName]) : null;
                        repository.CloseClientWithCallback(function () {
                            callback(returnedItems, returnedError);
                        });
                    });
            });
        };
        MongoRepository.prototype.FindPaged = function (query, page, size, callback) {
            var repository = this;
            var collectionName = this.CollectionName;
            // Start ->| ... prev. page ... | ... curr. page ... | ... nex. page ... |<- End
            var start = page == 0 ? page * size : (page - 1) * size;
            var end = (page + 2) * size;
            var total = end - start;
            this.DoCollectionOperation(collectionName, function (collection, err) {
                if (err) {
                    console.log('Error finding records from ' + collectionName + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                }
                else
                    collection.find(query).sort('ModifiedDate', -1).skip(start).limit(total).toArray(function (err, items) {
                        var logMessage = err ? 'Error finding records from ' + collectionName + '\n' + err : 'Retrieved page ' + page + ' from ' + collectionName + ' matching condition ' + JSON.stringify(query) + '. Total records count ' + items.length;
                        console.log(logMessage);
                        if (err || items == null) {
                            var errorModel = ErrorsModel.Model.ClientErrorsModel.CreateWithError('FindPagedError', [collectionName, page.toString()]);
                            repository.CloseClientWithCallback(function () {
                                callback(null, errorModel);
                            });
                            return;
                        }
                        //Total count and collection version identifier
                        collection.aggregate(repository.GetCollectionInfoAggregationObject(query), function (err, agg) {
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
        };
        //Create
        MongoRepository.prototype.Create = function (data, callback) {
            var repository = this;
            var collectionName = this.CollectionName;
            var IdentifierRepository = new Repository.Data.IdentifierRepository();
            IdentifierRepository.GetNewIdentifierFor(collectionName, data, function (id, err) {
                if (err || !id)
                    callback(null, err);
                else
                    data['Id'] = id;
                repository.DoCollectionOperation(collectionName, function (collection, err) {
                    var now = (new Date()).getTime();
                    data['CreatedDate'] = now;
                    data['ModifiedDate'] = now;
                    if (err) {
                        console.log('Error creating new record with id ' + id + ' in collection ' + collectionName + '\n' + err);
                        callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                    }
                    else
                        collection.insert(data, { w: 1 }, function (err, result) {
                            var logMessage = err ? 'Error creating new record with id ' + id + ' in collection ' + collectionName + '\n' + err : 'Created new record with id ' + id + ' in collection ' + collectionName;
                            console.log(logMessage);
                            var itemizedResult = result.length == 1 ? result[0] : result;
                            var returnedItem = err ? null : itemizedResult;
                            var returnedError = err ? ErrorsModel.Model.ClientErrorsModel.CreateWithError('CreateNewError', [collectionName]) : null;
                            repository.CloseClientWithCallback(function () {
                                callback(returnedItem, returnedError);
                            });
                        });
                });
            });
        };
        MongoRepository.prototype.CreateMultiple = function (data, callback) {
            throw new Error();
        };
        //Update
        MongoRepository.prototype.Update = function (data, callback) {
            var repository = this;
            var collectionName = this.CollectionName;
            repository.DoCollectionOperation(collectionName, function (collection, err) {
                var now = (new Date()).getTime();
                var modified = data['ModifiedDate'];
                data['ModifiedDate'] = now;
                var setter = { $set: { Data: data['Data'], Fields: data['Fields'], ModifiedDate: now } };
                var recordQuery = ConfigServer.Config.Server.UseOptimisticConcurrencyUpdate ? { "Id": data['Id'], "ModifiedDate": modified } : { "Id": data['Id'] };
                if (err) {
                    console.log('Error updating record with id ' + data['Id'] + ' from ' + collectionName + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                }
                else
                    collection.update(recordQuery, setter, { w: 1 }, function (err, result) {
                        var logMessage = err ? 'Error updating record with id ' + data['Id'] + ' from ' + collectionName + '\n' + err : (result == 0 ? 'Could not update record with id ' + data['Id'] + ' from ' + collectionName + '. No record found, or concurrency error' : 'Updated record with id ' + data['Id'] + ' in collection ' + collectionName);
                        console.log(logMessage);
                        var returnedItem = err ? null : data;
                        var returnedError = (err || result == 0) ? ErrorsModel.Model.ClientErrorsModel.CreateWithError('UpdateExistingError', [collectionName]) : null;
                        repository.CloseClientWithCallback(function () {
                            callback(returnedItem, returnedError);
                        });
                    });
            });
        };
        //Delete
        MongoRepository.prototype.Delete = function (id, callback) {
            var repository = this;
            var collectionName = this.CollectionName;
            var idNum = parseInt(id);
            repository.DoCollectionOperation(collectionName, function (collection, err) {
                if (err) {
                    console.log('Error deleting record with id ' + id + ' from ' + collectionName + '\n' + err);
                    callback(null, ErrorsModel.Model.ClientErrorsModel.CreateWithError('DatabaseConnectionError', null));
                }
                else
                    collection.remove({ "Id": idNum }, function (err) {
                        var logMessage = err ? 'Error deleting record with id ' + id + ' from ' + collectionName + '\n' + err : 'Deleted record with id ' + id + ' in collection ' + collectionName;
                        console.log(logMessage);
                        var returnedItem = err ? null : true;
                        var returnedError = err ? ErrorsModel.Model.ClientErrorsModel.CreateWithError('UpdateExistingError', [collectionName]) : null;
                        repository.CloseClientWithCallback(function () {
                            callback(returnedItem, returnedError);
                        });
                    });
            });
        };
        return MongoRepository;
    })(Base.Data.MongoRepositoryBase);
    Data.MongoRepository = MongoRepository;
})(Data = exports.Data || (exports.Data = {}));
//# sourceMappingURL=MongoRepository.js.map