/// <reference path="../../models/security/userSessionModel.ts" />
/// <reference path="../../interfaces/services/repository/IUserRepositoryService.ts" />
/// <reference path="../../interfaces/services/repository/IUrlLocatorService.ts" />
/// <reference path="../../interfaces/services/repository/IHttpWrapperService.ts" />

//Service that communicates with server side Node api and retrieves/saves user related data
module Services {
    'use strict';

    export class UserRepositoryService implements Services.IUserRepositoryService {
        //@ngInject
        constructor(private HttpWrapperService:Services.IHttpWrapperService,
                    private UrlLocatorService:Services.IUrlLocatorService) {
        }

        public LoginUser(userName:string, password:string, stayLoggedIn:boolean, callback:(session:Models.UserSession, errorsModel:any) => void):void {
            var postData:any = {
                userName: userName,
                password: password,
                stayLoggedIn: stayLoggedIn
            };

            var url:string = this.UrlLocatorService.GetUrlForLogin();
            this.HttpWrapperService.AnonymousPost(url, 'Login', postData).then(
                //Success
                function (data:Models.UserSession):void {
                    callback(data, null);
                },
                //Error
                function (errorsData:any):void {
                    callback(null, errorsData);
                });
        }
    }
}
