/// <reference path="../../../models/fieldMetadataModel.ts" />
/// <reference path="../../../models/entityMetadataModel.ts" />
/// <reference path="../../../directives/fieldDirectiveBase.ts" />

'use strict';

//Interface for every UI component for creating/editing specific type of data (= form field)
module Components.FieldTypes {
    export interface IFieldType {
        //Identifier
        FieldName:string;

        //Directive registration
        DirectiveName:string;
        DirectiveOptions():any[];

        //Metadata model
        CreateMetadata():Models.FieldMetadata;

        //Format value
        FormatValue(value:any):string;

        //Field filtering
        CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[];
        CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any;

        ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void;
        CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[];

        //Field creation form
        CreateFieldForm():Models.EntityMetadata;
    }
}
