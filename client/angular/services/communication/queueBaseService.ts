/// <reference path="../../../extensions/arrayExtensions.ts" />

//Base class for queue service. Contains registry of queues and methods to push and withdraw messages from them
module Services {
    'use strict';

    export class QueueBaseService {
        //Queues
        private _queues:any[][] = [];

        //General implementation for queue manipulation
        public addToQueue(queueName:string, message:any):void {
            var queue:any[] = this._queues[queueName];
            if (typeof queue === 'undefined') {
                queue = [];
                this._queues[queueName] = queue;
            }

            queue.push(message);
        }

        public retrieveMessageFromQueue(queueName:string, fifoMode:boolean):any {
            var queue:any[] = this._queues[queueName];
            if (typeof queue === 'undefined') {
                return null;
            } else if (queue.length === 0) {
                return null;
            }

            return fifoMode ? queue.shift() : queue.pop();
        }

        public retrieveAllMessagesFromQueue(queueName:string):any[] {
            var queue:any[] = this._queues[queueName];
            if (typeof queue === 'undefined') {
                return null;
            } else if (queue.length === 0) {
                return [];
            }

            var queueCopy:any[] = queue.createCopy();
            this._queues[queueName] = [];
            return queueCopy;
        }
    }
}
