/// <reference path="../../../models/entityModel.ts" />

'use strict';

//Interface for Filter converter service (creates filter query string and database query object)
module Services {
    export interface IFilterConverterService {
        CreateDatabaseQueryFromFilter(metadata:Models.EntityMetadata, filterEntity:Models.Entity):any;
        CreateFilterFormMetadataFromEntityMetadata(metadata:Models.EntityMetadata):Models.EntityMetadata;

        ParseFilterQueryString(metadata:Models.EntityMetadata, routeParams:any):Models.Entity;
        CreateFilterQueryString(metadata:Models.EntityMetadata, filterEntity:Models.Entity):string;
    }
}
