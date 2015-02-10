/// <reference path="../../localization/IResources.ts" />

'use strict';

//Interface for Localization service (returns resources for current user language)
module Services {
    export interface ILocalizationService {
        Resources:Localization.IResources;
        GetResourceByKey(key:string, args:string[]):string;
    }
}
