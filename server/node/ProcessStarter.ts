/// <reference path="../GlobalReferences.ts" />

//Modules
var ConfigServer:any = require('../config/Config').Config.Server;
var ConfigClient:any = require('../config/ClientConfig').Config.ClientConfig;

export module NodeHelpers {
    'use strict';

    export class ProcessStarter {
        public static ApplyProcessParameters(process:any):void {
            process.argv.forEach(function (val:string, index:number, array:string[]):void {
                var dbConfigKey:string = 'database=';
                if (val.indexOf(dbConfigKey) === 0) {
                    var databaseName:string = val.replace(dbConfigKey, '');
                    console.log('Going to use database \'' + databaseName + '\' insted of \'' + ConfigServer.BerryFormsDatabaseName + '\'');
                    ConfigServer.BerryFormsDatabaseName = databaseName;
                }

                var configurationKey:string = 'configuration=';
                if (val.indexOf(configurationKey) === 0) {
                    var configurationName:string = val.replace(configurationKey, '');
                    console.log('Using configuration \'' + configurationName + '\'');
                    ConfigClient.ConfigurationName = configurationName;
                }
            });
        }
    }
}
