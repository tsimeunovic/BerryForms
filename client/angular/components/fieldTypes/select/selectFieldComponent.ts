/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../../data/createFieldFormFields.ts" />
/// <reference path="./selectFieldDirective.ts" />
/// <reference path="./selectFieldFilter.ts" />
/// <reference path="./selectFieldFormFields.ts" />

'use strict';

module Components.FieldTypes {
    export class SelectFieldComponent implements IFieldType {
        //Identifier
        FieldName:string = 'Select';

        //Directive registration
        DirectiveName:string = 'fieldSelect';
        DirectiveOptions():any[] {
            return Directives.SelectField.injection();
        }

        //Metadata model
        CreateMetadata():Models.FieldMetadata {
            return new Models.SelectFieldMetadata();
        }

        //Format value
        FormatValue(value:any):string {
            return value ? value.Text : null;
        }

        //Field filtering
        CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            return Components.FieldTypes.SelectFieldFilter.CreateFilterFields(fieldMetadata);
        }
        CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            return Components.FieldTypes.SelectFieldFilter.CreateFilterQuery(fieldMetadata, filterValues);
        }

        ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            return Components.FieldTypes.SelectFieldFilter.ParseFilterQueryString(fieldMetadata, filterEntity, routeParams);
        }
        CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            return Components.FieldTypes.SelectFieldFilter.CreateFilterQueryString(fieldMetadata, filterValues);
        }

        //Field creation form
        CreateFieldForm():Models.EntityMetadata {
            return Data.CreateSelectFieldFormFields.GetData();
        }
    }
}

_global.Components.FieldTypes.push(new Components.FieldTypes.SelectFieldComponent());
