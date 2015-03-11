/// <reference path="../../config/Config.ts" />
/// <reference path="../common/IMongoRepository.ts" />

'use strict';

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

        public LogOperationAsync(requestContext:any, collection:string, id:number, operation:string, additionalArgs:any, callback:(error:any)=>void) {
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
                    if (callback) callback(err);
                });
            });
        }
    }
}
