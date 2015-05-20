/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/interaction/INotificationService.ts" />

module Mocks {
    'use strict';

    export class NotificationServiceMock implements Services.INotificationService {
        constructor() {
            this.Setup();
        }

        public NotifyMessage(message:string, severity:Static.NotificationSeverity):void {
            //Do nothing
        }

        public Notify(key:string, args:string[], severity:Static.NotificationSeverity):void {
            //Do nothing
        }

        public HandleErrorsModel(errorsModel:any):void {
            //Do nothing
        }

        private Setup():void {
            spyOn(this, 'NotifyMessage').and.callThrough();
            spyOn(this, 'Notify').and.callThrough();
            spyOn(this, 'HandleErrorsModel').and.callThrough();
        }
    }
}
