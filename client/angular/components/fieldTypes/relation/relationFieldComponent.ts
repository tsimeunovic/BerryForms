/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../../data/createFieldFormFields.ts" />
/// <reference path="./relationFieldDirective.ts" />
/// <reference path="./relationFieldMetadataModel.ts" />
/// <reference path="./relationFieldFormFields.ts" />
/// <reference path="./relationFieldFilter.ts" />

'use strict';

module Components.FieldTypes {
    export class RelationFieldComponent implements IFieldType {
        //Identifier
        FieldName:string = 'Relation';

        //Directive registration
        DirectiveName:string = 'fieldRelation';
        DirectiveOptions():any[] {
            return Directives.RelationField.injection();
        }

        //Metadata model
        CreateMetadata():Models.FieldMetadata {
            return new Models.RelationFieldMetadata();
        }

        //Format value
        FormatValue(value:any):string {
            return value ? value.Text : null;
        }

        //Field filtering
        CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            return Components.FieldTypes.RelationFieldFilter.CreateFilterFields(fieldMetadata);
        }
        CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            return Components.FieldTypes.RelationFieldFilter.CreateFilterQuery(fieldMetadata, filterValues);
        }

        ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            return Components.FieldTypes.RelationFieldFilter.ParseFilterQueryString(fieldMetadata, filterEntity, routeParams);
        }
        CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            return Components.FieldTypes.RelationFieldFilter.CreateFilterQueryString(fieldMetadata, filterValues);
        }

        //Field creation form
        CreateFieldForm():Models.EntityMetadata {
            return Data.CreateRelationFieldFormFields.GetData();
        }
    }
}

_global.Components.FieldTypes.push(new Components.FieldTypes.RelationFieldComponent());
