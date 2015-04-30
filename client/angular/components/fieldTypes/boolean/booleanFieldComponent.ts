/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../../data/createFieldFormFields.ts" />
/// <reference path="./booleanFieldDirective.ts" />
/// <reference path="./booleanFieldFormFields.ts" />
/// <reference path="./booleanFieldFilter.ts" />

'use strict';

module Components.FieldTypes {
    export class BooleanFieldComponent implements IFieldType {
        //Identifier
        public FieldName:string = 'Boolean';

        //Directive registration
        public DirectiveName:string = 'fieldBoolean';

        public DirectiveOptions():any[] {
            return Directives.BooleanField.injection();
        }

        //Metadata model
        public CreateMetadata():Models.FieldMetadata {
            return new Models.BooleanFieldMetadata();
        }

        //Format value
        public FormatValue(value:any):string {
            if (value === null || value === undefined) {
                return null;
            }
            return value ?
                Services.LocalizationService.Resources.Yes :
                Services.LocalizationService.Resources.No;
        }

        //Field filtering
        public CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            return Components.FieldTypes.BooleanFieldFilter.CreateFilterFields(fieldMetadata);
        }

        public CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            return Components.FieldTypes.BooleanFieldFilter.CreateFilterQuery(fieldMetadata, filterValues);
        }

        public ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            return Components.FieldTypes.BooleanFieldFilter.ParseFilterQueryString(fieldMetadata, filterEntity, routeParams);
        }

        public CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            return Components.FieldTypes.BooleanFieldFilter.CreateFilterQueryString(fieldMetadata, filterValues);
        }

        //Field creation form
        public CreateFieldForm():Models.EntityMetadata {
            return Data.CreateBooleanFieldFormFields.GetData();
        }
    }
}

_global.Components.FieldTypes.push(new Components.FieldTypes.BooleanFieldComponent());
