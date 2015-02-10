/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/state/IStateService.ts" />

'use strict';

module Mocks {
    export class StateServiceMock implements Services.IStateService {
        constructor() {
            this.Setup();
        }

        private Setup():void {
            spyOn(this, 'SetEditedEntity').and.callThrough();
            spyOn(this, 'GetEditedEntity').and.callThrough();
        }

        private EditedEntity:Models.Entity;

        //Mock members
        public SetEditedEntity(entity:Models.Entity):void {
            this.EditedEntity = entity;
        }
        public GetEditedEntity(entityName:string, entityId:number):Models.Entity {
            return this.EditedEntity;
        }
    }
}
