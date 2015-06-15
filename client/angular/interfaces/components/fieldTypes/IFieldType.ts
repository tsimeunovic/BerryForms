/// <reference path="../../../models/core/fieldMetadataModel.ts" />
/// <reference path="../../../models/core/entityMetadataModel.ts" />
/// <reference path="../../../components/fieldTypes/baseFieldDirective.ts" />

'use strict';

//Interface for every UI component for creating/editing specific type of data (= form field)
module Components.FieldTypes {
    export interface IFieldType {
        //Identifier
        FieldName:string;

        //Directive and its controller registration
        DirectiveName:string;
        DirectiveControllerName:string;
        DirectiveOptions():any[];
        DirectiveControllerOptions():any[];

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
