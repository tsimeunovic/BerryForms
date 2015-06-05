/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/state/IPersistentStorageService.ts" />

module Mocks {
    'use strict';

    export class PersistentStorageServiceMock implements Services.IPersistentStorageService {
        constructor() {
            this.Setup();
        }

        private PersistedUserSession:Models.UserSession;

        public SaveUserSession(userSession:Models.UserSession):void {
            this.PersistedUserSession = userSession;
        }

        public LoadUserSession():Models.UserSession {
            return this.PersistedUserSession || null;
        }

        private Setup():void {
            spyOn(this, 'SaveUserSession').and.callThrough();
            spyOn(this, 'LoadUserSession').and.callThrough();
        }
    }
}
