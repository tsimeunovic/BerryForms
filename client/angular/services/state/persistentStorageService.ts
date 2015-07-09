/// <reference path="../../interfaces/services/state/IPersistentStorageService.ts" />
/// <reference path="../../interfaces/services/state/IStateService.ts" />

//Provides access to browser persistent storage (local storage) for storing data between page reloads
module Services {
    'use strict';

    export class PersistentStorageService implements Services.IPersistentStorageService {
        //@ngInject
        constructor() {
            //Nothing to do here
        }

        //Keys
        private UserSessionKey:string = 'UserSession';

        //Interface methods
        public SaveUserSession(userSession:Models.UserSession):void {
            this.SaveObject<Models.UserSession>(this.UserSessionKey, userSession);
        }

        public LoadUserSession():Models.UserSession {
            return this.LoadObject<Models.UserSession>(this.UserSessionKey);
        }

        //Local storage access methods
        private LoadObject<T>(key:string):T {
            if (localStorage) {
                var objStr:string = localStorage.getItem(key);
                return objStr ? JSON.parse(objStr) : null;
            }
            return null;
        }

        private SaveObject<T>(key:string, object:T):void {
            if (localStorage) {
                var objStr:string = JSON.stringify(object);
                localStorage.setItem(key, objStr);
            }
        }
    }
}
