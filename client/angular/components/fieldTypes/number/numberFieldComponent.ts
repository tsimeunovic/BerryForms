/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../../data/createFieldFormFields.ts" />
/// <reference path="./numberFieldDirective.ts" />
/// <reference path="./numberFieldController.ts" />
/// <reference path="./numberFieldFormFields.ts" />
/// <reference path="./numberFieldFilter.ts" />

module Components.FieldTypes {
    'use strict';

    export class NumberFieldComponent implements IFieldType {
        //Identifier
        public FieldName:string = 'Number';

        //Directive and its controller registration
        public DirectiveName:string = 'fieldNumber';
        public DirectiveControllerName:string = 'NumberFieldController';

        public DirectiveOptions():any[] {
            return Directives.NumberField.injection();
        }

        public DirectiveControllerOptions():any[] {
            return Components.FieldTypes.NumberFieldController.injection();
        }

        //Metadata model
        public CreateMetadata():Models.FieldMetadata {
            return new Models.NumberFieldMetadata();
        }

        //Format value
        public FormatValue(value:any):string {
            return value;
        }

        //Field filtering
        public CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            return Components.FieldTypes.NumberFieldFilter.CreateFilterFields(fieldMetadata);
        }
        public CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            return Components.FieldTypes.NumberFieldFilter.CreateFilterQuery(fieldMetadata, filterValues);
        }

        public ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            return Components.FieldTypes.NumberFieldFilter.ParseFilterQueryString(fieldMetadata, filterEntity, routeParams);
        }
        public CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            return Components.FieldTypes.NumberFieldFilter.CreateFilterQueryString(fieldMetadata, filterValues);
        }

        //Field creation form
        public CreateFieldForm():Models.EntityMetadata {
            return Data.CreateNumberFieldFormFields.GetData();
        }
    }
}

_global.Components.FieldTypes.push(new Components.FieldTypes.NumberFieldComponent());
