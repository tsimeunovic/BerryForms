/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../../data/createFieldFormFields.ts" />
/// <reference path="./dateFieldDirective.ts" />
/// <reference path="./dateFieldFormFields.ts" />
/// <reference path="./dateFieldFilter.ts" />

'use strict';

module Components.FieldTypes {
    export class DateFieldComponent implements IFieldType {
        //Identifier
        FieldName:string = 'Date';

        //Directive registration
        DirectiveName:string = 'fieldDate';
        DirectiveOptions():any[] {
            return Directives.DateField.injection();
        }

        //Metadata model
        CreateMetadata():Models.FieldMetadata {
            return new Models.DateFieldMetadata();
        }

        //Format value
        FormatValue(value:any):string {
            if(!value) return null;
            var date = new Date(value);
            return date.format(Config.Client.DatepickerFormat);
        }

        //Field filtering
        CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            return Components.FieldTypes.DateFieldFilter.CreateFilterFields(fieldMetadata);
        }
        CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            return Components.FieldTypes.DateFieldFilter.CreateFilterQuery(fieldMetadata, filterValues);
        }

        ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            return Components.FieldTypes.DateFieldFilter.ParseFilterQueryString(fieldMetadata, filterEntity, routeParams);
        }
        CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            return Components.FieldTypes.DateFieldFilter.CreateFilterQueryString(fieldMetadata, filterValues);
        }

        //Field creation form
        CreateFieldForm():Models.EntityMetadata {
            return Data.CreateDateFieldFormFields.GetData();
        }
    }
}

_global.Components.FieldTypes.push(new Components.FieldTypes.DateFieldComponent());
