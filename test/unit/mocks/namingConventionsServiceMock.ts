/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/system/INamingConventionsService.ts" />

'use strict';

module Mocks {
    export class NamingConventionsServiceMock implements Services.INamingConventionsService {
        constructor() {
            this.Setup();
        }

        private Setup():void {
        }

        public GetSystemEntityName(entityName:string):string {
            return '#' + entityName;
        }

        public GetSystemFieldName(fieldName:string):string {
            return '#' + fieldName;
        }
    }
}
