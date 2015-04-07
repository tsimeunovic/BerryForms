/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../../data/createFieldFormFields.ts" />
/// <reference path="./textFieldDirective.ts" />
/// <reference path="./textFieldFormFields.ts" />
/// <reference path="./textFieldFilter.ts" />

'use strict';

module Components.FieldTypes {
    export class TextFieldComponent implements IFieldType {
        //Identifier
        FieldName:string = 'Text';

        //Directive registration
        DirectiveName:string = 'fieldText';
        DirectiveOptions():any[] {
            return Directives.TextField.injection();
        }

        //Metadata model
        CreateMetadata():Models.FieldMetadata {
            return new Models.TextFieldMetadata();
        }

        //Format value
        FormatValue(value:any):string {
            return value;
        }

        //Field filtering
        CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            return Components.FieldTypes.TextFieldFilter.CreateFilterFields(fieldMetadata);
        }
        CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            return Components.FieldTypes.TextFieldFilter.CreateFilterQuery(fieldMetadata, filterValues);
        }

        ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            return Components.FieldTypes.TextFieldFilter.ParseFilterQueryString(fieldMetadata, filterEntity, routeParams);
        }
        CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            return Components.FieldTypes.TextFieldFilter.CreateFilterQueryString(fieldMetadata, filterValues);
        }

        //Field creation form
        CreateFieldForm():Models.EntityMetadata {
            return Data.CreateTextFieldFormFields.GetData();
        }
    }
}

_global.Components.FieldTypes.push(new Components.FieldTypes.TextFieldComponent());
