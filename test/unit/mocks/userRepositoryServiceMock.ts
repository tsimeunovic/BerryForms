/// <reference path="../../../client/angular/interfaces/services/repository/IUserRepositoryService.ts" />

'use strict';

module Mocks {
    export class UserRepositoryServiceMock implements Services.IUserRepositoryService {
        constructor() {
            this.Setup();
        }

        private Setup():void {
            this.Responses = [];

            spyOn(this, 'LoginUser').and.callThrough();
        }

        private Responses:any[];

        public AddResponse(method:string, result:any, errorModel:any) {
            this.Responses.push({
                Method: method,
                Result: result,
                ErrorModel: errorModel,
                AnyResponse: result != null || errorModel != null
            });
        }

        private ResponseFor(method:string):any {
            var configuredResponsePredicate = function (response) {
                return response.Method == method
            };
            return this.Responses.single(configuredResponsePredicate);
        }

        public LoginUser(userName:string, password:string, callback:(session:Models.UserSession, errors:any)=>void):void {
            var defaultObject = new Models.UserSession();
            defaultObject.ValidTo = (new Date()).getTime() + 10 * 60 * 1000;
            var user = new Models.User();
            user.UserName = userName;
            user.IsSuperUser = true;
            defaultObject.User = user;

            var configuredResponse = this.ResponseFor('LoginUser');
            if (configuredResponse && configuredResponse.AnyResponse) callback(configuredResponse.Result, configuredResponse.ErrorModel);
            else if (!configuredResponse) callback(defaultObject, null);
        }
    }
}