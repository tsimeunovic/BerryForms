/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../../data/createFieldFormFields.ts" />
/// <reference path="./textareaFieldDirective.ts" />
/// <reference path="./textareaFieldFormFields.ts" />
/// <reference path="./textareaFieldFilter.ts" />

'use strict';

module Components.FieldTypes {
    export class TextareaFieldComponent implements IFieldType {
        //Identifier
        FieldName:string = 'Textarea';

        //Directive registration
        DirectiveName:string = 'fieldTextarea';
        DirectiveOptions():any[] {
            return Directives.TextareaField.injection();
        }

        //Metadata model
        CreateMetadata():Models.FieldMetadata {
            return new Models.TextareaFieldMetadata();
        }

        //Format value
        FormatValue(value:any):string {
            return value;
        }

        //Field filtering
        CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            return Components.FieldTypes.TextareaFieldFilter.CreateFilterFields(fieldMetadata);
        }
        CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            return Components.FieldTypes.TextareaFieldFilter.CreateFilterQuery(fieldMetadata, filterValues);
        }

        ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            return Components.FieldTypes.TextareaFieldFilter.ParseFilterQueryString(fieldMetadata, filterEntity, routeParams);
        }
        CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            return Components.FieldTypes.TextareaFieldFilter.CreateFilterQueryString(fieldMetadata, filterValues);
        }

        //Field creation form
        CreateFieldForm():Models.EntityMetadata {
            return Data.CreateTextareaFieldFormFields.GetData();
        }
    }
}

_global.Components.FieldTypes.push(new Components.FieldTypes.TextareaFieldComponent());
