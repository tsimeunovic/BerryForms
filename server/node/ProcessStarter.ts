/// <reference path="../GlobalReferences.ts" />

'use strict';

//Modules
var ConfigServer:any = require('../config/Config').Config.Server;
var ConfigClient:any = require('../config/ClientConfig').Config.ClientConfig;

export module NodeHelpers {
    export class ProcessStarter {
        public static ApplyProcessParameters(process:any):void {
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
        }
    }
}
