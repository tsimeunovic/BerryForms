/// <reference path="../GlobalReferences.ts" />

export module Config {
    'use strict';

    export class ClientConfig {
        //Run configuration name
        public static ConfigurationName:string = 'Default';

        public static GetClientConfigurationOverrides(request:any, callback:(data:any, errors:any) => void):void {
            var configObject:any = {};
            if (ClientConfig.ConfigurationName === 'e2e_Tests') {
                configObject.NotificationDisplayTimeMs = 50;
                configObject.SearchTypingWaitTimeMs = 50;
                configObject.LoadResourcesAsynchronously = false;
            }
            callback(configObject, null);
        }
    }
}
