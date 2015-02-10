/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../../data/createFieldFormFields.ts" />
/// <reference path="./booleanFieldDirective.ts" />
/// <reference path="./booleanFieldFormFields.ts" />
/// <reference path="./booleanFieldFilter.ts" />

'use strict';

module Components.FieldTypes {
    export class BooleanFieldComponent implements IFieldType {
        //Identifier
        FieldName:string = 'Boolean';

        //Directive registration
        DirectiveName:string = 'fieldBoolean';

        DirectiveOptions():any[] {
            return Directives.BooleanField.injection();
        }

        //Metadata model
        CreateMetadata():Models.FieldMetadata {
            return new Models.BooleanFieldMetadata();
        }

        //Format value
        FormatValue(value:any):string {
            if (value === null || value === undefined) return null;
            return value ?
                Services.LocalizationService.Resources.Yes :
                Services.LocalizationService.Resources.No;
        }

        //Field filtering
        CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            return Components.FieldTypes.BooleanFieldFilter.CreateFilterFields(fieldMetadata);
        }

        CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            return Components.FieldTypes.BooleanFieldFilter.CreateFilterQuery(fieldMetadata, filterValues);
        }

        ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            return Components.FieldTypes.BooleanFieldFilter.ParseFilterQueryString(fieldMetadata, filterEntity, routeParams);
        }

        CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            return Components.FieldTypes.BooleanFieldFilter.CreateFilterQueryString(fieldMetadata, filterValues);
        }

        //Field creation form
        CreateFieldForm():Models.EntityMetadata {
            return Data.CreateBooleanFieldFormFields.GetData();
        }
    }
}

_global.Components.FieldTypes.push(new Components.FieldTypes.BooleanFieldComponent());
