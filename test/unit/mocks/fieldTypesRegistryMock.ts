/// <reference path="../../jasmine.d.ts" />
/// <reference path="./fieldTypeMock.ts" />
/// <reference path="../../../client/angular/interfaces/components/fieldTypes/IFieldTypesRegistry.ts" />

'use strict';

module Mocks {
    export class FieldTypesRegistryMock implements Components.FieldTypes.IFieldTypesRegistry {
        constructor() {
            this.Setup();
        }

        private FieldTypeMock:Components.FieldTypes.IFieldType;

        private Setup():void {
            spyOn(this, 'GetFieldType').and.callThrough();
            this.FieldTypeMock = new Mocks.FieldTypeMock();
        }

        public GetFieldType(fieldTypeName:string, useDefaultForNonExisting:boolean):Components.FieldTypes.IFieldType {
            if(fieldTypeName != 'UnknownTypeName') return this.FieldTypeMock;
            else return null;
        }
    }
}
