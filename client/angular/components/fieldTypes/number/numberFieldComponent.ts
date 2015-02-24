/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../../data/createFieldFormFields.ts" />
/// <reference path="./numberFieldDirective.ts" />
/// <reference path="./numberFieldFormFields.ts" />
/// <reference path="./numberFieldFilter.ts" />

'use strict';

module Components.FieldTypes {
    export class NumberFieldComponent implements IFieldType {
        //Identifier
        FieldName:string = 'Number';

        //Directive registration
        DirectiveName:string = 'fieldNumber';
        DirectiveOptions():any[] {
            return Directives.NumberField.injection();
        }

        //Metadata model
        CreateMetadata():Models.FieldMetadata {
            return new Models.NumberFieldMetadata();
        }

        //Format value
        FormatValue(value:any):string {
            return value;
        }

        //Field filtering
        CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            return Components.FieldTypes.NumberFieldFilter.CreateFilterFields(fieldMetadata);
        }
        CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            return Components.FieldTypes.NumberFieldFilter.CreateFilterQuery(fieldMetadata, filterValues);
        }

        ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            return Components.FieldTypes.NumberFieldFilter.ParseFilterQueryString(fieldMetadata, filterEntity, routeParams);
        }
        CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            return Components.FieldTypes.NumberFieldFilter.CreateFilterQueryString(fieldMetadata, filterValues);
        }

        //Field creation form
        CreateFieldForm():Models.EntityMetadata {
            return Data.CreateNumberFieldFormFields.GetData();
        }
    }
}

_global.Components.FieldTypes.push(new Components.FieldTypes.NumberFieldComponent());
