/// <reference path="../../models/security/userSessionModel.ts" />
/// <reference path="../../interfaces/services/repository/IUserRepositoryService.ts" />

'use strict';

//Service that communicates with server side Node api and retrieves/saves user related data
module Services {
    export class UserRepositoryService implements Services.IUserRepositoryService {
        public static injection():any[] {
            return [
                'HttpWrapperService',
                'UrlLocatorService',
                UserRepositoryService
            ];
        }

        constructor(private HttpWrapperService:Services.IHttpWrapperService,
                    private UrlLocatorService:Services.IUrlLocatorService) {
        }

        public LoginUser(userName:string, password:string, callback:(session:Models.UserSession, errorsModel:any)=>void):void {
            var postData:any = {userName: userName, password: password};
            var url = this.UrlLocatorService.GetUrlForLogin();
            this.HttpWrapperService.AnonymousPost(url, 'Login', postData).then(
                //Success
                function (data:Models.UserSession) {
                    callback(data, null);
                },
                //Error
                function (errorsData) {
                    callback(null, errorsData);
                });
        }
    }
}