/// <reference path="../GlobalReferences.ts" />
'use strict';
//Modules
var ConfigServer = require('../config/Config').Config.Server;
var ConfigClient = require('../config/ClientConfig').Config.ClientConfig;
var NodeHelpers;
(function (NodeHelpers) {
    var ProcessStarter = (function () {
        function ProcessStarter() {
        }
        ProcessStarter.ApplyProcessParameters = function (process) {
            process.argv.forEach(function (val, index, array) {
                var dbConfigKey = 'database=';
                if (val.indexOf(dbConfigKey) == 0) {
                    var databaseName = val.replace(dbConfigKey, '');
                    console.log('Going to use database \'' + databaseName + '\' insted of \'' + ConfigServer.BerryFormsDatabaseName + '\'');
                    ConfigServer.BerryFormsDatabaseName = databaseName;
                }
                var configurationKey = 'configuration=';
                if (val.indexOf(configurationKey) == 0) {
                    var configurationName = val.replace(configurationKey, '');
                    console.log('Using configuration \'' + configurationName + '\'');
                    ConfigClient.ConfigurationName = configurationName;
                }
            });
        };
        return ProcessStarter;
    })();
    NodeHelpers.ProcessStarter = ProcessStarter;
})(NodeHelpers = exports.NodeHelpers || (exports.NodeHelpers = {}));
//# sourceMappingURL=ProcessStarter.js.map