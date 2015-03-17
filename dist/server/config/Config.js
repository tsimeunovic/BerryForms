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
        //Security
        Server.TokenValidityMinutes = 15;
        Server.PasswordSalt = 'I^F^y_UmK~G^=1i+xPi|t1_lSOiq~+~La=CvE1Yeh4V~izp~4AnEDVixy4R|';
        Server.TokenSalt = 'RO^zMe1jFN%9L9BgNlP~LJqOvN15ZCAv9lct-+uIgDZWsnaNks0%ZKw3guul';
        Server.SuperUserName = 'admin';
        Server.SuperUserPassword = 'admin';
        //Miscelanous
        Server.LogRetrieveCount = 12;
        Server.LogSummaryMinutes = 1 * 24 * 60; //1 day
        return Server;
    })();
    Config.Server = Server;
})(Config = exports.Config || (exports.Config = {}));
//# sourceMappingURL=Config.js.map