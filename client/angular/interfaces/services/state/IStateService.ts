/// <reference path="../../../models/entityModel.ts" />

'use strict';

//Interface for State service (stores state that needs to be preserved between page switches)
module Services {
    export interface IStateService {
        //Entity being created/edited
        SetEditedEntity(entity:Models.Entity):void;
        GetEditedEntity(entityName:string, entityId:number):Models.Entity;
    }
}
