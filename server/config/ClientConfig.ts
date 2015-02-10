/// <reference path="../GlobalReferences.ts" />

'use strict';

export module Config {
    export class ClientConfig {
        //Run configuration name
        public static ConfigurationName = 'Default';

        public static GetClientConfigurationOverrides(request:any, callback:(data:any, errors:any)=>void):void {
            var configObject = {};
            if (ClientConfig.ConfigurationName == 'e2e_Tests') {
                configObject['NotificationDisplayTimeMs'] = 50;
                configObject['SearchTypingWaitTimeMs'] = 50;
                configObject['LoadResourcesAsynchronously'] = false;
            }
            callback(configObject, null);
        }
    }
}
