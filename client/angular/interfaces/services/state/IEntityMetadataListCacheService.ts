/// <reference path="ICacheService.ts" />
/// <reference path="../../../models/core/entityMetadataModel.ts" />

'use strict';

//Interface for Entity metadata cache service (stores all entity types)
module Services {
    export interface IEntityMetadataListCacheService extends Services.ICacheService<Models.EntityMetadata[]> {
        //Entity metadata list specific methods
        LoadEntityMetadataFromCache(entitySystemName:string, callback:(entityMetadata:Models.EntityMetadata)=>void):void;
    }
}
