/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/localization/ILocalizationService.ts" />
/// <reference path="../../../client/angular/localization/en/Resources.ts" />
/// <reference path="../../../client/angular/interfaces/localization/IResources.ts" />

'use strict';
var _global:any = this;

module Mocks {
    export class LocalizationServiceMock implements Services.ILocalizationService {
        constructor() {
            this.Setup();
        }

        private Setup():void {
            var resources:any = _global.Localization.Resources;
            var resourcesMock:any = {};
            for(var prop in resources) {
                if(resources.hasOwnProperty(prop)) resourcesMock[prop] = '#' + prop;
            }

            this.Resources = resourcesMock;
            spyOn(this, 'GetResourceByKey').and.callThrough();
        }

        //Mock members
        public Resources:Localization.IResources;

        public GetResourceByKey(key:string, args:string[]):string {
            return '#' + key;
        }
    }
}
