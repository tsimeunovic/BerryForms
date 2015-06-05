/// <reference path="../../../models/security/userSessionModel.ts" />

//Interface for Persistent storage service (stores data between page reloads)
module Services {
    'use strict';

    export interface IPersistentStorageService {
        //User session
        SaveUserSession(userSession:Models.UserSession):void;
        LoadUserSession():Models.UserSession;
    }
}
