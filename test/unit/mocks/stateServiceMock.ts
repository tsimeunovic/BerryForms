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
            spyOn(this, 'SetCurrentUserSession').and.callThrough();
            spyOn(this, 'GetCurrentUserSession').and.callThrough();
            spyOn(this, 'UpdateCurrentUserSession').and.callThrough();
            spyOn(this, 'RegisterPostLoginAction').and.callThrough();
        }

        private EditedEntity:Models.Entity;

        //Mock members
        public SetEditedEntity(entity:Models.Entity):void {
            this.EditedEntity = entity;
        }
        public GetEditedEntity(entityName:string, entityId:number):Models.Entity {
            return this.EditedEntity;
        }

        public SetCurrentUserSession(userSession:Models.UserSession):void {
        }

        public GetCurrentUserSession():Models.UserSession {
            var session = new Models.UserSession();
            session.ValidTo = (new Date()).getTime() + 10 * 60 * 1000;
            var user = new Models.User();
            user.UserName = 'MockUser';
            user.IsSuperUser = true;
            session.User = user;
            return session;
        }

        public UpdateCurrentUserSession(validTo:number, token:string):void {
        }

        public RegisterPostLoginAction(actionName:string, canCancel:boolean, action:()=>void):void {
        }
    }
}
