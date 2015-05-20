/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/repository/IUserRepositoryService.ts" />
/// <reference path="../../../client/extensions/arrayExtensions.ts" />

module Mocks {
    'use strict';

    export class UserRepositoryServiceMock implements Services.IUserRepositoryService {
        constructor() {
            this.Setup();
        }

        private Responses:any[];

        public AddResponse(method:string, result:any, errorModel:any):void {
            this.Responses.push({
                Method: method,
                Result: result,
                ErrorModel: errorModel,
                AnyResponse: result != null || errorModel != null
            });
        }

        public LoginUser(userName:string, password:string, callback:(session:Models.UserSession, errors:any) => void):void {
            var defaultObject:Models.UserSession = new Models.UserSession();
            defaultObject.ValidTo = (new Date()).getTime() + 10 * 60 * 1000;
            var user:Models.User = new Models.User();
            user.UserName = userName;
            user.IsSuperUser = true;
            defaultObject.User = user;

            var configuredResponse:any = this.ResponseFor('LoginUser');
            if (configuredResponse && configuredResponse.AnyResponse) {
                callback(configuredResponse.Result, configuredResponse.ErrorModel);
            } else if (!configuredResponse) {
                callback(defaultObject, null);
            }
        }

        private Setup():void {
            this.Responses = [];

            spyOn(this, 'LoginUser').and.callThrough();
        }

        private ResponseFor(method:string):any {
            var configuredResponsePredicate:(r:any) => boolean = function (response:any):boolean {
                return response.Method === method;
            };
            return this.Responses.single(configuredResponsePredicate);
        }
    }
}
