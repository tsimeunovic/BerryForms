/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../../data/createFieldFormFields.ts" />
/// <reference path="./textFieldDirective.ts" />
/// <reference path="./textFieldFormFields.ts" />
/// <reference path="./textFieldFilter.ts" />

module Components.FieldTypes {
    'use strict';

    export class TextFieldComponent implements IFieldType {
        //Identifier
        public FieldName:string = 'Text';

        //Directive registration
        public DirectiveName:string = 'fieldText';
        public DirectiveOptions():any[] {
            return Directives.TextField.injection();
        }

        //Metadata model
        public CreateMetadata():Models.FieldMetadata {
            return new Models.TextFieldMetadata();
        }

        //Format value
        public FormatValue(value:any):string {
            return value;
        }

        //Field filtering
        public CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            return Components.FieldTypes.TextFieldFilter.CreateFilterFields(fieldMetadata);
        }
        public CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            return Components.FieldTypes.TextFieldFilter.CreateFilterQuery(fieldMetadata, filterValues);
        }

        public ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            return Components.FieldTypes.TextFieldFilter.ParseFilterQueryString(fieldMetadata, filterEntity, routeParams);
        }
        public CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            return Components.FieldTypes.TextFieldFilter.CreateFilterQueryString(fieldMetadata, filterValues);
        }

        //Field creation form
        public CreateFieldForm():Models.EntityMetadata {
            return Data.CreateTextFieldFormFields.GetData();
        }
    }
}

_global.Components.FieldTypes.push(new Components.FieldTypes.TextFieldComponent());
