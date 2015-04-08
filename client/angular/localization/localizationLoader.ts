/// <reference path="../../extensions/stringExtensions.ts" />
/// <reference path="../../extensions/arrayExtensions.ts" />
/// <reference path="../../config/config.ts" />

'use strict';
var _global:any = this; //Sets _global variable that localization files are using
_global.ResourcesToLoad = _global.ResourcesToLoad || [];

//Class that loads resources for user language and registers them in the system
module Localization {
    class LocalizationLoader {
        public static LoadLocalizationFile() {
            var userLanguage = this.DetermineUserLanguage();
            var resourcesUrl = Config.Client.LocalizedResourcesBaseUrl.format([userLanguage]);
            _global.ResourcesToLoad.push({Url: resourcesUrl, Callback: LocalizationLoader.ResourceLoaded});
            document.body.className = userLanguage;
        }

        private static DetermineUserLanguage():string {
            var userPreferredLanguage = (navigator.language || navigator.userLanguage || Config.Client.LanguageDefault);
            return Config.Client.LanguagesSupported.contains(userPreferredLanguage) ? userPreferredLanguage : Config.Client.LanguageDefault;
        }

        private static ResourceLoaded(data:any):void {
            eval(data);
        }
    }

    (function () {
        LocalizationLoader.LoadLocalizationFile();
    })();
}
