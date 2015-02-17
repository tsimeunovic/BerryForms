/// <reference path="../../../models/security/userSessionModel.ts" />

'use strict';

//Interface for User repository service (communicates with server side Node api and retrieves/saves user related data)
module Services {
    export interface IUserRepositoryService {
        LoginUser(userName:string, password:string, callback:(session:Models.UserSession, errorsModel:any)=>void):void;
    }
}