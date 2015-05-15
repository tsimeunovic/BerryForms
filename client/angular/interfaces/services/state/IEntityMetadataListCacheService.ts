/// <reference path="ICacheService.ts" />
/// <reference path="../../../models/core/entityMetadataModel.ts" />

//Interface for Entity metadata cache service (stores all entity types)
module Services {
    'use strict';

    export interface IEntityMetadataListCacheService extends Services.ICacheService<Models.EntityMetadata[]> {
        //Entity metadata list specific methods
        LoadEntityMetadataFromCache(entitySystemName:string, callback:(entityMetadata:Models.EntityMetadata) => void):void;
    }
}
