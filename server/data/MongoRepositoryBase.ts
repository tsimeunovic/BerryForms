/// <reference path="../config/Config.ts" />
/// <reference path="./IRepository.ts" />

'use strict';

var ConfigServer:any = require('../config/Config').Config.Server;

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
                        LastModified: { $max: '$ModifiedDate'},
                        Count: { $sum: 1 }
                    }
                }
            ];
        }
    }
}
