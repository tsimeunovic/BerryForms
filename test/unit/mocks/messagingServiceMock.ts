/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/communication/IMessagingService.ts" />

module Mocks {
    'use strict';

    export class MessagingServiceMock implements Services.IMessagingService {
        constructor() {
            this.Setup();
        }

        //Mock members
        public Messages:Services.IMessagingServiceType;

        private Setup():void {
            //Clone IMessagingServiceType object with all members without implementation
            var messages:Services.IMessagingServiceType = JSON.parse(JSON.stringify(new Services.IMessagingServiceType()));
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

            var functionNames:string[] = ['subscribe', 'unsubscribe', 'publish'];
            if (!hasOwnProperties) {
                for (var i:number = 0; i < functionNames.length; i++) {
                    var functionName:string = functionNames[i];
                    object[functionName] = function ():void {
                        //Do nothing
                    };
                    spyOn(object, functionName);
                }
            }
        }
    }
}
