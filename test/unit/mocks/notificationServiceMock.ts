/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/interaction/INotificationService.ts" />

'use strict';

module Mocks {
    export class NotificationServiceMock implements Services.INotificationService {
        constructor() {
            this.Setup();
        }

        private Setup():void {
            spyOn(this, 'NotifyMessage').and.callThrough();
            spyOn(this, 'Notify').and.callThrough();
            spyOn(this, 'HandleErrorsModel').and.callThrough();
        }

        public NotifyMessage(message:string, severity:Static.NotificationSeverity):void {
        }

        public Notify(key:string, args:string[], severity:Static.NotificationSeverity):void {
        }

        public HandleErrorsModel(errorsModel:any):void {
        }
    }
}
