/// <reference path="../../interfaces/services/state/IStateService.ts" />
/// <reference path="../../models/entityModel.ts" />

'use strict';

//Stores the state of application for scenarios when it should be preserved (for example page switch while editing)
module Services {
    export class StateService implements Services.IStateService {
        public static injection():any[] {
            return [
                StateService
            ];
        }

        constructor() {
            this.EditedEntity = null;
        }

        private EditedEntity:Models.Entity;

        SetEditedEntity(entity:Models.Entity):void {
            this.EditedEntity = entity;
        }

        GetEditedEntity(entityName:string, entityId:number):Models.Entity {
            if (!this.EditedEntity ||
                this.EditedEntity.EntitySystemName != entityName ||
                this.EditedEntity.Id != entityId) {
                this.EditedEntity = null;
            }
            return this.EditedEntity;
        }
    }
}
