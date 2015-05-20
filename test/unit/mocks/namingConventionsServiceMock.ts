/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/system/INamingConventionsService.ts" />

module Mocks {
    'use strict';

    export class NamingConventionsServiceMock implements Services.INamingConventionsService {
        constructor() {
            this.Setup();
        }

        public GetSystemEntityName(entityName:string):string {
            return '#' + entityName;
        }

        public GetSystemFieldName(fieldName:string):string {
            return '#' + fieldName;
        }

        private Setup():void {
            spyOn(this, 'GetSystemEntityName').and.callThrough();
            spyOn(this, 'GetSystemFieldName').and.callThrough();
        }
    }
}
