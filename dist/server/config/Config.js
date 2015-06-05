/// <reference path="../GlobalReferences.ts" />
var Config;
(function (Config) {
    'use strict';
    var Server = (function () {
        function Server() {
        }
        //General
        Server.SystemPrefix = '__';
        //Node server
        Server.NodePort = 8080;
        Server.ApiPrefix = 'api';
        //Mongo Db
        Server.MongoServerUri = 'localhost';
        Server.MongoServerPort = 27017;
        Server.BerryFormsDatabaseName = 'BerryForms';
        Server.UseOptimisticConcurrencyUpdate = true;
        //Security
        Server.TokenValidityMinutes = 15;
        Server.StayLoggedInTokenValidityMinutes = 7 * 24 * 60; //7 days
        Server.KeepMeLoggedInTokenValidityMinutes = 15 * 24 * 60; //15 days
        Server.PasswordSalt = 'I^F^y_UmK~G^=1i+xPi|t1_lSOiq~+~La=CvE1Yeh4V~izp~4AnEDVixy4R|';
        //Changing will break entire password database
        Server.TokenSalt = 'RO^zMe1jFN%9L9BgNlP~LJqOvN15ZCAv9lct-+uIgDZWsnaNks0%ZKw3guul';
        //Changing will invalidate all currently valid tokens
        Server.SuperUserName = 'admin';
        Server.SuperUserPassword = 'admin';
        //Miscellaneous
        Server.LogRetrieveCount = 8;
        Server.LogSummaryMinutes = 7 * 24 * 60; //7 days
        Server.FieldSummarySample = 512;
        return Server;
    })();
    Config.Server = Server;
})(Config = exports.Config || (exports.Config = {}));
//# sourceMappingURL=Config.js.map