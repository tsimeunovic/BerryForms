/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../../data/createFieldFormFields.ts" />
/// <reference path="./listFieldDirective.ts" />
/// <reference path="./listFieldController.ts" />
/// <reference path="./listFieldFormFields.ts" />
/// <reference path="./listFieldFilter.ts" />

module Components.FieldTypes {
    'use strict';

    export class ListFieldComponent implements IFieldType {
        //Identifier
        public FieldName:string = 'List';

        //Directive and its controller registration
        public DirectiveName:string = 'fieldList';
        public DirectiveControllerName:string = 'ListFieldController';

        public DirectiveOptions():any[] {
            return Directives.ListField.injection();
        }

        public DirectiveControllerOptions():any[] {
            return Components.FieldTypes.ListFieldController.injection();
        }

        //Metadata model
        public CreateMetadata():Models.FieldMetadata {
            return new Models.ListFieldMetadata();
        }

        //Format value
        public FormatValue(value:any):string {
            if (!value || !value.length) {
                return null;
            }
            return value.join(', ');
        }

        //Field filtering
        public CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            return Components.FieldTypes.ListFieldFilter.CreateFilterFields(fieldMetadata);
        }

        public CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            return Components.FieldTypes.ListFieldFilter.CreateFilterQuery(fieldMetadata, filterValues);
        }

        public ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            return Components.FieldTypes.ListFieldFilter.ParseFilterQueryString(fieldMetadata, filterEntity, routeParams);
        }

        public CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            return Components.FieldTypes.ListFieldFilter.CreateFilterQueryString(fieldMetadata, filterValues);
        }

        //Field creation form
        public CreateFieldForm():Models.EntityMetadata {
            return Data.CreateListFieldFormFields.GetData();
        }
    }
}

_global.Components.FieldTypes.push(new Components.FieldTypes.ListFieldComponent());
