/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../../data/createFieldFormFields.ts" />
/// <reference path="./listFieldDirective.ts" />
/// <reference path="./listFieldFormFields.ts" />
/// <reference path="./listFieldFilter.ts" />

'use strict';

module Components.FieldTypes {
    export class ListFieldComponent implements IFieldType {
        //Identifier
        FieldName:string = 'List';

        //Directive registration
        DirectiveName:string = 'fieldList';
        DirectiveOptions():any[] {
            return Directives.ListField.injection();
        }

        //Metadata model
        CreateMetadata():Models.FieldMetadata {
            return new Models.ListFieldMetadata();
        }

        //Format value
        FormatValue(value:any):string {
            if(!value || !value.length) return null;
            return value.join(', ');
        }

        //Field filtering
        CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            return Components.FieldTypes.ListFieldFilter.CreateFilterFields(fieldMetadata);
        }
        CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            return Components.FieldTypes.ListFieldFilter.CreateFilterQuery(fieldMetadata, filterValues);
        }

        ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            return Components.FieldTypes.ListFieldFilter.ParseFilterQueryString(fieldMetadata, filterEntity, routeParams);
        }
        CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            return Components.FieldTypes.ListFieldFilter.CreateFilterQueryString(fieldMetadata, filterValues);
        }

        //Field creation form
        CreateFieldForm():Models.EntityMetadata {
            return Data.CreateListFieldFormFields.GetData();
        }
    }
}

_global.Components.FieldTypes.push(new Components.FieldTypes.ListFieldComponent());
