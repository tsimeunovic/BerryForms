/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/communication/IQueueService.ts" />

'use strict';

module Mocks {
    export class QueueServiceMock implements Services.IQueueService {
        constructor() {
            this.Setup();
        }

        private Setup():void {
            var queues = JSON.parse(JSON.stringify(new Services.IQueueServiceType()));
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

            var functionNames = ['add', 'retrieveFirst', 'retrieveLast', 'retrieveAll'];
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
        public Queues:Services.IQueueServiceType;
    }
}
