/// <reference path="../../interfaces/localization/IResources.ts" />
/// <reference path="../../interfaces/services/localization/ILocalizationService.ts" />

'use strict';
var _global:any = this;

//Service providing access to localization resources for user language
module Services {
    export class LocalizationService implements Services.ILocalizationService {
        public static injection():any[] {
            return [
                LocalizationService
            ];
        }

        constructor() {
            this.Resources = _global.Localization.Resources;
            LocalizationService.Resources = _global.Localization.Resources;
        }

        //Entry point for resources
        public Resources:Localization.IResources;

        //Static entry point for resources (for data classes and models where testability is not required)
        public static Resources:Localization.IResources;

        public GetResourceByKey(key:string, args:string[]):string
        {
            return this.Resources[key].format(args);
        }
    }
}
