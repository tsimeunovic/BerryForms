/// <reference path="../config/config.ts" />

'use strict';
var _global:any = this;
_global.ServerObjects = _global.ServerObjects || {};

//Class that loads configuration overrides from server and applies them on client
module Config {
    class ConfigLoader {
        public static ApplyConfigurationOverrides() {
            var overridesObject:any = _global.ServerObjects.ConfigurationOverrides || {};
            for (var prop in overridesObject) {
                if (overridesObject.hasOwnProperty(prop)) Config.Client[prop] = overridesObject[prop];
            }
        }
    }

    (function () {
        ConfigLoader.ApplyConfigurationOverrides();
    })();
}
