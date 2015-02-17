/// <reference path="../../../client/angular/interfaces/services/repository/IUserRepositoryService.ts" />

'use strict';

module Mocks {
    export class UserRepositoryServiceMock implements Services.IUserRepositoryService {
        constructor() {
            this.Setup();
        }

        private Setup():void {
            spyOn(this, 'LoginUser').and.callThrough();
        }

        public LoginUser(userName:string, password:string, callback:(session:Models.UserSession, errors:any)=>void):void {
            var session = new Models.UserSession();
            session.ValidTo = (new Date()).getTime() + 10 * 60 * 1000;
            var user = new Models.User();
            user.UserName = userName;
            user.IsSuperUser = true;
            session.User = user;
            callback(session, null);
        }
    }
}