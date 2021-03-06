/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/components/fieldTypes/IFieldType.ts" />

module Mocks {
    'use strict';

    export class FieldTypeMock implements Components.FieldTypes.IFieldType {
        constructor() {
            this.Setup();
        }

        public FieldName:string;
        public DirectiveName:string;
        DirectiveControllerName:string;

        public DirectiveOptions():any[] {
            return null;
        }

        public DirectiveControllerOptions():any[] {
            return null;
        }

        public CreateMetadata():Models.FieldMetadata {
            var fieldModel:Models.FieldMetadata = new Models.FieldMetadata('MockFieldMetadata');
            fieldModel.FieldName = this.FieldName;
            fieldModel.FieldSpecialProperties = ['Special'];
            fieldModel.MapAdditionalProperties = function (entity:Models.Entity):void {
                this.Additional = 'AdditionalValue';
            };
            return fieldModel;
        }

        public FormatValue(value:any):string {
            return '#' + value;
        }

        public CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            var mockField1:Models.FieldMetadata = new Models.FieldMetadata(fieldMetadata.FieldName + '1');
            mockField1.FieldName = fieldMetadata.FieldName + '1';
            mockField1.FieldSystemName = fieldMetadata.FieldSystemName + '1';
            var mockField2:Models.FieldMetadata = new Models.FieldMetadata(fieldMetadata.FieldName + '2');
            mockField2.FieldName = fieldMetadata.FieldName + '2';
            mockField2.FieldSystemName = fieldMetadata.FieldSystemName + '2';
            return [mockField1, mockField2];
        }

        public CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            var result:any = {};
            for (var i:number = 0; i < filterValues.length; i++) {
                result[fieldMetadata.FieldSystemName + i.toString()] = filterValues[i];
            }
            return result;
        }

        public ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            if (routeParams[fieldMetadata.FieldSystemName + '1']) {
                filterEntity.Data[fieldMetadata.FieldSystemName + '1'] = routeParams[fieldMetadata.FieldSystemName + '1'];
            }
            if (routeParams[fieldMetadata.FieldSystemName + '2']) {
                filterEntity.Data[fieldMetadata.FieldSystemName + '2'] = routeParams[fieldMetadata.FieldSystemName + '2'];
            }
        }

        public CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            var result:string[] = [];
            for (var i:number = 0; i < filterValues.length; i++) {
                result.push(fieldMetadata.FieldSystemName + i.toString() + '=' + filterValues[i].toString());
            }
            return result;
        }

        public CreateFieldForm():Models.EntityMetadata {
            return null;
        }

        private Setup():void {
            spyOn(this, 'DirectiveOptions').and.callThrough();
            spyOn(this, 'CreateMetadata').and.callThrough();
            spyOn(this, 'FormatValue').and.callThrough();
            spyOn(this, 'CreateFilterFields').and.callThrough();
            spyOn(this, 'CreateFilterQuery').and.callThrough();
            spyOn(this, 'ParseFilterQueryString').and.callThrough();
            spyOn(this, 'CreateFilterQueryString').and.callThrough();
            spyOn(this, 'CreateFieldForm').and.callThrough();

            this.FieldName = 'MockFieldName';
            this.DirectiveName = 'MockDirectiveName';
        }
    }
}
