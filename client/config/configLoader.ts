/// <reference path="../config/config.ts" />

var _global:any = this;
_global.ServerObjects = _global.ServerObjects || {};

//Class that loads configuration overrides from server and applies them on client
module Config {
    'use strict';

    class ConfigLoader {
        public static ApplyConfigurationOverrides():void {
            var overridesObject:any = _global.ServerObjects.ConfigurationOverrides || {};
            for (var prop in overridesObject) {
                if (overridesObject.hasOwnProperty(prop)) {
                    Config.Client[prop] = overridesObject[prop];
                }
            }
        }
    }

    (function ():void {
        ConfigLoader.ApplyConfigurationOverrides();
    })();
}
