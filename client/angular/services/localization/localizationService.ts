/// <reference path="../../interfaces/localization/IResources.ts" />
/// <reference path="../../interfaces/services/localization/ILocalizationService.ts" />

var _global:any = this;

//Service providing access to localization resources for user language
module Services {
    'use strict';

    export class LocalizationService implements Services.ILocalizationService {
        //Static entry point for resources (for data classes and models where testability is not required)
        public static Resources:Localization.IResources;

        //@ngInject
        constructor() {
            this.Resources = _global.Localization.Resources;
            LocalizationService.Resources = _global.Localization.Resources;
        }

        //Entry point for resources
        public Resources:Localization.IResources;

        public GetResourceByKey(key:string, args:string[]):string {
            return this.Resources[key].format(args);
        }
    }
}
