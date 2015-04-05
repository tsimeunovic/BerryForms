/// <reference path="../../config/Config.ts" />
/// <reference path="../common/IMongoRepository.ts" />

'use strict';

import ErrorsModel = require('../../model/ClientErrorsModel');
var ConfigServer:any = require('../../config/Config').Config.Server;

var MongoClientObject:any = require('mongodb').MongoClient;
var MongoServerObject:any = require('mongodb').Server;

var MongoServerInstance:any = new MongoServerObject(ConfigServer.MongoServerUri, ConfigServer.MongoServerPort);
var MongoClientInstance:any = new MongoClientObject(MongoServerInstance);

//Use single long-living connection
var Db:any;
MongoClientInstance.open(function (err, MongoClientLocal:any) {
    if (err) {
        console.log('Could not establish connection to Mongo database ' + ConfigServer.MongoServerUri);
    }
    else {
        console.log('Connected to Mongo database ' + ConfigServer.MongoServerUri);
        Db = MongoClientLocal.db(ConfigServer.BerryFormsDatabaseName);
    }
});

export module Data {
    export class MongoRepositoryBase {
        constructor(collectionName:string) {
            this.CollectionName = collectionName;
        }

        public CollectionName:string;

        //Private methods
        public OpenClientWithAction(action:(db:any, err:any)=>void):void {
            //Do not call open for every action
            action(Db, null);
        }

        public CloseClientWithCallback(callback:()=>void):void {
            //Do not close client
            callback();
        }

        public DoCollectionOperation(collectionName:string, collectionAction:(collection:any, err:any)=>void):void {
            Db.collection(collectionName, function (err, collection) {
                if (err) collectionAction(null, err);
                else collectionAction(collection, null);
            });
        }

        public GetCollectionInfoAggregationObject(query:any):any {
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
                        LastModified: {$max: '$ModifiedDate'},
                        Count: {$sum: 1}
                    }
                }
            ];
        }

        public GetLogSummaryAggregationObject(entities:string[], minutes:number):any {
            var timeFrom = (new Date()).getTime() - minutes * 60 * 1000;
            return [
                //Select user entities in last x:minutes
                {
                    $match: {
                        "Collection": {"$in": entities},
                        "Time": {"$gt": timeFrom}
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
                            "Collection": "$Collection",
                            "Operation": "$Operation"
                        },
                        OperationsCount: {$sum: 1}
                    }
                },
                //Sort by most active operation
                {
                    $sort: {OperationsCount: -1}
                }
            ];
        }

        public LogOperationAsync(requestContext:any, collection:string, id:number, operation:string, additionalArgs:any, callback:(error:any)=>void) {
            var _this = this;
            var logCollectionName:string = ConfigServer.SystemPrefix + 'log';
            var logObject = {
                Time: (new Date()).getTime(),
                User: requestContext.session ? requestContext.session.User.UserName : null,
                Collection: collection,
                Id: id,
                Operation: operation
            };

            this.DoCollectionOperation(logCollectionName, function (collection, err) {
                var logObjectStr:string = JSON.stringify(logObject);
                if (err) {
                    console.log('Could not write log record \'' + logObjectStr + '\'');
                    if (callback) callback(err);
                }
                else collection.insert(logObject, {w: 1}, function (err, result) {
                    if (err) console.log('Could not write log record \'' + logObjectStr + '\'');
                    if (callback)_this.CloseClientWithCallback(function () {
                        callback(err);
                    });
                });
            });
        }

        public GetLatestLogRecordsFor(userName:string, entities:string[], count:number, callback:(data:any[], err:any)=>void) {
            var _this = this;
            var logCollectionName:string = ConfigServer.SystemPrefix + 'log';
            var collectionQuery = {
                "Collection": {"$in": entities}
            };
            if (userName) collectionQuery["User"] = {$eq: userName};

            this.DoCollectionOperation(logCollectionName, function (collection, err) {
                if (err) {
                    console.log('Could not open log collection.');
                    if (callback) callback(null, err);
                }
                else collection.find(collectionQuery)
                    .sort('Time', -1)
                    .skip(0).limit(count)
                    .toArray(function (err, items) {
                        var logMessage = err ?
                        'Error finding log records' + '\n' + err :
                            null;

                        if (logMessage) console.log(logMessage);
                        var returnedItems = err ? null : items;
                        var returnedError = err ? ErrorsModel.Model.ClientErrorsModel.CreateWithError('ReadLogError', null) : null;

                        _this.CloseClientWithCallback(function () {
                            callback(returnedItems, returnedError);
                        });
                    });
            });
        }

        public GetEntitiesSummary(entities:string[], minutes:number, callback:(data:any[], err:any)=>void):void {
            var _this = this;
            var logCollectionName:string = ConfigServer.SystemPrefix + 'log';
            var aggregationObject:any[] = this.GetLogSummaryAggregationObject(entities, minutes);

            this.DoCollectionOperation(logCollectionName, function (collection, err) {
                if (err) {
                    console.log('Could not open log collection.');
                    if (callback) callback(null, err);
                }
                else collection.aggregate(aggregationObject, function (err, agg) {
                    if (err || agg == null) {
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
                            var itemCollectionName:string = resultItem["_id"].Collection;
                            var itemOperationName:string = resultItem["_id"].Operation;
                            var itemOperationCount:number = resultItem.OperationsCount;

                            var aggregate = indexedResult[itemCollectionName];
                            if (!aggregate) {
                                aggregate = {
                                    Collection: itemCollectionName,
                                    TotalOperationsCount: 0
                                };
                                indexedResult[itemCollectionName] = aggregate;
                                result.push(aggregate)
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
            });
        }
    }
}
