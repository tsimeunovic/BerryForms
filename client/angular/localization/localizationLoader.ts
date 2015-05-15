/// <reference path="../../extensions/stringExtensions.ts" />
/// <reference path="../../extensions/arrayExtensions.ts" />
/// <reference path="../../config/config.ts" />

var _global:any = this; //Sets _global variable that localization files are using
_global.ResourcesToLoad = _global.ResourcesToLoad || [];

//Class that loads resources for user language and registers them in the system
module Localization {
    'use strict';

    class LocalizationLoader {
        public static LoadLocalizationFile():void {
            var userLanguage:string = this.DetermineUserLanguage();
            var resourcesUrl:string = Config.Client.LocalizedResourcesBaseUrl.format([userLanguage]);
            _global.ResourcesToLoad.push({Url: resourcesUrl, Callback: LocalizationLoader.ResourceLoaded});
            document.body.className = userLanguage;
        }

        private static DetermineUserLanguage():string {
            var userPreferredLanguage:string = (navigator.language || navigator.userLanguage || Config.Client.LanguageDefault);
            return Config.Client.LanguagesSupported.contains(userPreferredLanguage) ? userPreferredLanguage : Config.Client.LanguageDefault;
        }

        private static ResourceLoaded(data:any):void {
            /* tslint:disable:no-eval */
            eval(data);
        }
    }

    (function ():void {
        LocalizationLoader.LoadLocalizationFile();
    })();
}
