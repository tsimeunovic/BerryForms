/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/communication/IQueueService.ts" />

module Mocks {
    'use strict';

    export class QueueServiceMock implements Services.IQueueService {
        constructor() {
            this.Setup();
        }

        //Mock members
        public Queues:Services.IQueueServiceType;

        private Setup():void {
            //Clone IQueueServiceType object with all members without implementation
            var queues:Services.IQueueServiceType = JSON.parse(JSON.stringify(new Services.IQueueServiceType()));
            this.SetupQueueSpyingOnObject(queues);
            this.Queues = queues;
        }

        private SetupQueueSpyingOnObject(object:any):void {
            var hasOwnProperties:boolean = false;
            for (var prop in object) {
                if (object.hasOwnProperty(prop)) {
                    hasOwnProperties = true;
                    this.SetupQueueSpyingOnObject(object[prop]);
                }
            }

            var functionNames:string[] = ['add', 'retrieveFirst', 'retrieveLast', 'retrieveAll'];
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
