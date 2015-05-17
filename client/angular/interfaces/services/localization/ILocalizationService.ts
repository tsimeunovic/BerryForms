/// <reference path="../../localization/IResources.ts" />

//Interface for Localization service (returns resources for current user language)
module Services {
    'use strict';

    export interface ILocalizationService {
        Resources:Localization.IResources;
        GetResourceByKey(key:string, args:string[]):string;
    }
}
