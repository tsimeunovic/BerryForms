/// <reference path="../../config/Config.ts" />
/// <reference path="../common/IMongoRepository.ts" />
var ErrorsModel = require('../../model/ClientErrorsModel');
var ConfigServer = require('../../config/Config').Config.Server;
var MongoClientObject = require('mongodb').MongoClient;
var MongoServerObject = require('mongodb').Server;
var MongoServerInstance = new MongoServerObject(ConfigServer.MongoServerUri, ConfigServer.MongoServerPort);
var MongoClientInstance = new MongoClientObject(MongoServerInstance);
//Use single long-living connection
var Db;
MongoClientInstance.open(function (err, MongoClientLocal) {
    if (err) {
        console.log('Could not establish connection to Mongo database ' + ConfigServer.MongoServerUri);
    }
    else {
        console.log('Connected to Mongo database ' + ConfigServer.MongoServerUri);
        Db = MongoClientLocal.db(ConfigServer.BerryFormsDatabaseName);
    }
});
var Data;
(function (Data) {
    'use strict';
    var MongoRepositoryBase = (function () {
        function MongoRepositoryBase(collectionName) {
            this.CollectionName = collectionName;
        }
        //Private methods
        MongoRepositoryBase.prototype.OpenClientWithAction = function (action) {
            //Do not call open for every action
            action(Db, null);
        };
        MongoRepositoryBase.prototype.CloseClientWithCallback = function (callback) {
            //Do not close client
            callback();
        };
        MongoRepositoryBase.prototype.DoCollectionOperation = function (collectionName, collectionAction) {
            Db.collection(collectionName, function (err, collection) {
                if (err) {
                    collectionAction(null, err);
                }
                else {
                    collectionAction(collection, null);
                }
            });
        };
        MongoRepositoryBase.prototype.GetCollectionInfoAggregationObject = function (query) {
            return [
                {
                    $match: query
                },
                {
                    $project: {
                        _id: 0,
                        Id: 1,
                        ModifiedDate: 1
                    }
                },
                {
                    $group: {
                        _id: 'Id',
                        LastModified: { $max: '$ModifiedDate' },
                        Count: { $sum: 1 }
                    }
                }
            ];
        };
        MongoRepositoryBase.prototype.GetLogSummaryAggregationObject = function (entities, minutes) {
            var timeFrom = (new Date()).getTime() - minutes * 60 * 1000;
            return [
                //Select user entities in last x:minutes
                {
                    $match: {
                        Collection: { $in: entities },
                        Time: { $gt: timeFrom }
                    }
                },
                //Pick just fields we are interested in
                {
                    $project: {
                        _id: 0,
                        Collection: 1,
                        Operation: 1
                    }
                },
                //Group them by collection and operation
                {
                    $group: {
                        _id: {
                            Collection: '$Collection',
                            Operation: '$Operation'
                        },
                        OperationsCount: { $sum: 1 }
                    }
                },
                //Sort by most active operation
                {
                    $sort: { OperationsCount: -1 }
                }
            ];
        };
        MongoRepositoryBase.prototype.LogOperationAsync = function (requestContext, collection, id, operation, additionalArgs, callback) {
            var _this = this;
            var logCollectionName = ConfigServer.SystemPrefix + 'log';
            var logObject = {
                Time: (new Date()).getTime(),
                User: requestContext.session ? requestContext.session.User.UserName : null,
                Collection: collection,
                Id: id,
                Operation: operation
            };
            this.DoCollectionOperation(logCollectionName, function (collection, err) {
                var logObjectStr = JSON.stringify(logObject);
                if (err) {
                    console.log('Could not write log record \'' + logObjectStr + '\'');
                    if (callback) {
                        callback(err);
                    }
                }
                else {
                    collection.insert(logObject, { w: 1 }, function (err, result) {
                        if (err) {
                            console.log('Could not write log record \'' + logObjectStr + '\'');
                        }
                        if (callback) {
                            _this.CloseClientWithCallback(function () {
                                callback(err);
                            });
                        }
                    });
                }
            });
        };
        MongoRepositoryBase.prototype.GetLatestLogRecordsFor = function (userName, entities, count, callback) {
            var _this = this;
            var logCollectionName = ConfigServer.SystemPrefix + 'log';
            var collectionQuery = {
                Collection: { $in: entities }
            };
            if (userName) {
                collectionQuery.User = { $eq: userName };
            }
            this.DoCollectionOperation(logCollectionName, function (collection, err) {
                if (err) {
                    console.log('Could not open log collection.');
                    if (callback) {
                        callback(null, err);
                    }
                }
                else {
                    collection.find(collectionQuery)
                        .sort('Time', -1)
                        .skip(0).limit(count)
                        .toArray(function (err, items) {
                        var logMessage = err ?
                            'Error finding log records' + '\n' + err :
                            null;
                        if (logMessage) {
                            console.log(logMessage);
                        }
                        var returnedItems = err ?
                            null :
                            items;
                        var returnedError = err ?
                            ErrorsModel.Model.ClientErrorsModel.CreateWithError('ReadLogError', null) :
                            null;
                        _this.CloseClientWithCallback(function () {
                            callback(returnedItems, returnedError);
                        });
                    });
                }
            });
        };
        MongoRepositoryBase.prototype.GetEntitiesSummary = function (entities, minutes, callback) {
            var _this = this;
            var logCollectionName = ConfigServer.SystemPrefix + 'log';
            var aggregationObject = this.GetLogSummaryAggregationObject(entities, minutes);
            this.DoCollectionOperation(logCollectionName, function (collection, err) {
                if (err) {
                    console.log('Could not open log collection.');
                    if (callback) {
                        callback(null, err);
                    }
                }
                else {
                    collection.aggregate(aggregationObject, function (err, agg) {
                        if (err || agg === null) {
                            console.log(err);
                            var errorModel = ErrorsModel.Model.ClientErrorsModel.CreateWithError('ReadLogSummaryError', null);
                            _this.CloseClientWithCallback(function () {
                                callback(null, errorModel);
                            });
                        }
                        else {
                            //Create model
                            console.log('Retrieved entities summary for last \'' + minutes + '\' minutes');
                            var indexedResult = [];
                            var result = [];
                            for (var i = 0; i < agg.length; i++) {
                                var resultItem = agg[i];
                                var itemCollectionName = resultItem._id.Collection;
                                var itemOperationName = resultItem._id.Operation;
                                var itemOperationCount = resultItem.OperationsCount;
                                var aggregate = indexedResult[itemCollectionName];
                                if (!aggregate) {
                                    aggregate = {
                                        Collection: itemCollectionName,
                                        TotalOperationsCount: 0
                                    };
                                    indexedResult[itemCollectionName] = aggregate;
                                    result.push(aggregate);
                                }
                                switch (itemOperationName) {
                                    case 'create':
                                        aggregate.CreatedCount = itemOperationCount;
                                        aggregate.TotalOperationsCount += itemOperationCount;
                                        break;
                                    case 'update':
                                        aggregate.UpdatedCount = itemOperationCount;
                                        aggregate.TotalOperationsCount += itemOperationCount;
                                        break;
                                    case 'delete':
                                        aggregate.DeletedCount = itemOperationCount;
                                        aggregate.TotalOperationsCount += itemOperationCount;
                                        break;
                                    default:
                                        break;
                                }
                            }
                            _this.CloseClientWithCallback(function () {
                                callback(result, null);
                            });
                        }
                    });
                }
            });
        };
        return MongoRepositoryBase;
    })();
    Data.MongoRepositoryBase = MongoRepositoryBase;
})(Data = exports.Data || (exports.Data = {}));
//# sourceMappingURL=MongoRepositoryBase.js.map