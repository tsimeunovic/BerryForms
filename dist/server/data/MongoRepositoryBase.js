/// <reference path="../config/Config.ts" />
/// <reference path="./IRepository.ts" />
'use strict';
var ConfigServer = require('../config/Config').Config.Server;
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
                if (err)
                    collectionAction(null, err);
                else
                    collectionAction(collection, null);
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
        return MongoRepositoryBase;
    })();
    Data.MongoRepositoryBase = MongoRepositoryBase;
})(Data = exports.Data || (exports.Data = {}));
//# sourceMappingURL=MongoRepositoryBase.js.map