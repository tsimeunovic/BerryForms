/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../../data/createFieldFormFields.ts" />
/// <reference path="./relationFieldDirective.ts" />
/// <reference path="./relationFieldMetadataModel.ts" />
/// <reference path="./relationFieldFormFields.ts" />
/// <reference path="./relationFieldFilter.ts" />

module Components.FieldTypes {
    'use strict';

    export class RelationFieldComponent implements IFieldType {
        //Identifier
        public FieldName:string = 'Relation';

        //Directive registration
        public DirectiveName:string = 'fieldRelation';
        public DirectiveOptions():any[] {
            return Directives.RelationField.injection();
        }

        //Metadata model
        public CreateMetadata():Models.FieldMetadata {
            return new Models.RelationFieldMetadata();
        }

        //Format value
        public FormatValue(value:any):string {
            return value ? value.Text : null;
        }

        //Field filtering
        public CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            return Components.FieldTypes.RelationFieldFilter.CreateFilterFields(fieldMetadata);
        }
        public CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            return Components.FieldTypes.RelationFieldFilter.CreateFilterQuery(fieldMetadata, filterValues);
        }

        public ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            return Components.FieldTypes.RelationFieldFilter.ParseFilterQueryString(fieldMetadata, filterEntity, routeParams);
        }
        public CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            return Components.FieldTypes.RelationFieldFilter.CreateFilterQueryString(fieldMetadata, filterValues);
        }

        //Field creation form
        public CreateFieldForm():Models.EntityMetadata {
            return Data.CreateRelationFieldFormFields.GetData();
        }
    }
}

_global.Components.FieldTypes.push(new Components.FieldTypes.RelationFieldComponent());
