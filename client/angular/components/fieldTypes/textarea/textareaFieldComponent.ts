/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../../data/createFieldFormFields.ts" />
/// <reference path="../genericFieldDirective.ts" />
/// <reference path="./textareaFieldController.ts" />
/// <reference path="./textareaFieldFormFields.ts" />
/// <reference path="./textareaFieldFilter.ts" />

module Components.FieldTypes {
    'use strict';

    export class TextareaFieldComponent implements IFieldType {
        //Identifier
        public FieldName:string = 'Textarea';

        //Directive registration
        public DirectiveName:string = 'fieldTextarea';
        public DirectiveControllerName:string = 'TextareaFieldController';

        public DirectiveOptions():any[] {
            return Directives.GenericField.InjectionFor(this.FieldName);
        }

        public DirectiveControllerOptions():any {
            return Components.FieldTypes.TextareaFieldController;
        }

        //Metadata model
        public CreateMetadata():Models.FieldMetadata {
            return new Models.TextareaFieldMetadata();
        }

        //Format value
        public FormatValue(value:any):string {
            return value;
        }

        //Field filtering
        public CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            return Components.FieldTypes.TextareaFieldFilter.CreateFilterFields(fieldMetadata);
        }
        public CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            return Components.FieldTypes.TextareaFieldFilter.CreateFilterQuery(fieldMetadata, filterValues);
        }

        public ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            return Components.FieldTypes.TextareaFieldFilter.ParseFilterQueryString(fieldMetadata, filterEntity, routeParams);
        }
        public CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            return Components.FieldTypes.TextareaFieldFilter.CreateFilterQueryString(fieldMetadata, filterValues);
        }

        //Field creation form
        public CreateFieldForm():Models.EntityMetadata {
            return Data.CreateTextareaFieldFormFields.GetData();
        }
    }
}

_global.Components.FieldTypes.push(new Components.FieldTypes.TextareaFieldComponent());
