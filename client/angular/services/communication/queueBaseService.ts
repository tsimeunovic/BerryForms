'use strict';

//Base class for queue service. Contains registry of queues and methods to push and withdraw messages from them
module Services {
    export class QueueBaseService {
        //Queues
        private _queues:any[] = [];

        //General implementation for queue manipulation
        public addToQueue(queueName:string, message:any):void {
            var queue = this._queues[queueName];
            if (typeof queue == 'undefined') {
                queue = [];
                this._queues[queueName] = queue;
            }

            queue.push(message);
        }

        public retrieveMessageFromQueue(queueName:string, fifoMode:boolean):any {
            var queue = this._queues[queueName];
            if (typeof queue == 'undefined') return null;
            if (queue.length == 0) return null;

            return fifoMode ? queue.shift() : queue.pop();
        }

        public retrieveAllMessagesFromQueue(queueName:string):any[] {
            var queue = this._queues[queueName];
            if (typeof queue == 'undefined') return null;
            if (queue.length == 0) return [];

            var queueCopy = queue.createCopy();
            this._queues[queueName] = [];
            return queueCopy;
        }
    }
}
