/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/communication/IMessagingService.ts" />

'use strict';

module Mocks {
    export class MessagingServiceMock implements Services.IMessagingService {
        constructor() {
            this.Setup();
        }

        private Setup():void {
            var messages = JSON.parse(JSON.stringify(new Services.IMessagingServiceType()));
            this.SetupMessageSpyingOnObject(messages);
            this.Messages = messages;
        }

        private SetupMessageSpyingOnObject(object:any):void {
            var hasOwnProperties:boolean = false;
            for (var prop in object) {
                if (object.hasOwnProperty(prop)) {
                    hasOwnProperties = true;
                    this.SetupMessageSpyingOnObject(object[prop]);
                }
            }

            var functionNames = ['subscribe', 'unsubscribe', 'publish'];
            if (!hasOwnProperties) {
                for (var i = 0; i < functionNames.length; i++) {
                    var functionName = functionNames[i];
                    object[functionName] = function () {
                    };
                    spyOn(object, functionName);
                }
            }
        }

        //Mock members
        public Messages:Services.IMessagingServiceType;
    }
}
