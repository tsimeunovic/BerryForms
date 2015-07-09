/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../../data/createFieldFormFields.ts" />
/// <reference path="../genericFieldDirective.ts" />
/// <reference path="./selectFieldController.ts" />
/// <reference path="./selectFieldFilter.ts" />
/// <reference path="./selectFieldFormFields.ts" />

module Components.FieldTypes {
    'use strict';

    export class SelectFieldComponent implements IFieldType {
        //Identifier
        public FieldName:string = 'Select';

        //Directive and its controller registration
        public DirectiveName:string = 'fieldSelect';
        public DirectiveControllerName:string = 'SelectFieldController';

        public DirectiveOptions():any[] {
            return Directives.GenericField.InjectionFor(this.FieldName);
        }

        public DirectiveControllerOptions():any {
            return Components.FieldTypes.SelectFieldController;
        }

        //Metadata model
        public CreateMetadata():Models.FieldMetadata {
            return new Models.SelectFieldMetadata();
        }

        //Format value
        public FormatValue(value:any):string {
            return value ? value.Text : null;
        }

        //Field filtering
        public CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            return Components.FieldTypes.SelectFieldFilter.CreateFilterFields(fieldMetadata);
        }
        public CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            return Components.FieldTypes.SelectFieldFilter.CreateFilterQuery(fieldMetadata, filterValues);
        }

        public ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            return Components.FieldTypes.SelectFieldFilter.ParseFilterQueryString(fieldMetadata, filterEntity, routeParams);
        }
        public CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            return Components.FieldTypes.SelectFieldFilter.CreateFilterQueryString(fieldMetadata, filterValues);
        }

        //Field creation form
        public CreateFieldForm():Models.EntityMetadata {
            return Data.CreateSelectFieldFormFields.GetData();
        }
    }
}

_global.Components.FieldTypes.push(new Components.FieldTypes.SelectFieldComponent());
