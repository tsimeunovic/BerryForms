/// <reference path="../../../models/core/entityMetadataModel.ts" />
/// <reference path="../../../models/core/entityModel.ts" />

'use strict';

//Interface for Entity repository service (communicates with server side Node api and retrieves/saves data)
module Services {
    export interface IEntityRepositoryService {
        //Entities metadata
        LoadEntityMetadata(entityName:string, callback:(metadata:Models.EntityMetadata, errorsModel:any)=>void): void;
        SaveEntityMetadata(entityMetadata:Models.EntityMetadata, callback:(savedMetadata:Models.EntityMetadata, errorsModel:any)=>void): void;
        LoadAllEntityMetadata(callback:(entities:Models.EntityMetadata[], errorsModel:any)=>void):void;

        //Entities data
        LoadEntity(entityName:string, entityId:number, callback:(entity:Models.Entity, errorsModel:any)=>void):void;
        SaveEntity(entity:Models.Entity, callback:(savedEntity:Models.Entity, errorsModel:any)=>void):void;
        DeleteEntity(entity:Models.Entity, callback:(deletedEntity:Models.Entity, errorsModel:any)=>void):void;

        LoadAllEntities(entityName:string, callback:(entities:Models.Entity[], errorsModel:any)=>void):void;
        LoadPagedEntities(entityName:string, pageIndex:number, pageSize:number, callback:(pagedData:any, errorsModel:any)=>void):void;
        LoadSearchResults(entityMetadata:Models.EntityMetadata, searchExpression:string, callback:(searchExpression:string, searchResults:Models.SelectFieldOptionMetadata[], totalResultsCount:number, errorsModel:any)=>void):void;
        LoadPagedFilteredResults(entityName:string, query:any, pageIndex:number, pageSize:number, callback:(pagedData:any, errorsModel:any)=>void):void;
    }
}
