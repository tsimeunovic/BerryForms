/// <reference path="ICacheService.ts" />
/// <reference path="../../../models/entityMetadataModel.ts" />

'use strict';

//Interface for Entity list cache service (stores some of records of currently used type that matches query)
module Services {
    export interface IEntityListCacheService extends Services.ICacheService<Models.Entity[]> {
        //Entity list specific methods
        LoadEntityListPage(entitySystemName:string, query:any, pageIndex:number, callback:(entity:Models.Entity[], query:any, pageIndex:number, totalPages:number, errorsModel:any)=>void):void;
    }
}
