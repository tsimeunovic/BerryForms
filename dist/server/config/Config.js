/// <reference path="../GlobalReferences.ts" />
'use strict';
var Config;
(function (Config) {
    var Server = (function () {
        function Server() {
        }
        //General
        Server.SystemPrefix = '__';
        //Node server
        Server.NodePort = 8080;
        Server.ApiPrefix = 'api';
        //Mongo Db
        Server.MongoServerUri = "localhost";
        Server.MongoServerPort = 27017;
        Server.BerryFormsDatabaseName = "BerryForms";
        Server.UseOptimisticConcurrencyUpdate = true;
        return Server;
    })();
    Config.Server = Server;
})(Config = exports.Config || (exports.Config = {}));
//# sourceMappingURL=Config.js.map