/// <reference path="../GlobalReferences.ts" />
var Config;
(function (Config) {
    'use strict';
    var ClientConfig = (function () {
        function ClientConfig() {
        }
        ClientConfig.GetClientConfigurationOverrides = function (request, callback) {
            var configObject = {};
            if (ClientConfig.ConfigurationName === 'e2e_Tests') {
                configObject.NotificationDisplayTimeMs = 50;
                configObject.SearchTypingWaitTimeMs = 50;
                configObject.LoadResourcesAsynchronously = false;
            }
            callback(configObject, null);
        };
        //Run configuration name
        ClientConfig.ConfigurationName = 'Default';
        return ClientConfig;
    })();
    Config.ClientConfig = ClientConfig;
})(Config = exports.Config || (exports.Config = {}));
//# sourceMappingURL=ClientConfig.js.map