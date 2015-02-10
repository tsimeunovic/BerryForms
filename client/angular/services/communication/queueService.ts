/// <reference path="./queueBaseService.ts" />
/// <reference path="../../interfaces/services/communication/IQueueService.ts" />

'use strict';

//Service that provides named queues and methods to add and withdraw messages from them
module Services {
    export class QueueService extends QueueBaseService implements Services.IQueueService {
        public static injection():any[] {
            return [
                QueueService
            ];
        }

        constructor() {
            super();
            this.Setup();
        }

        //Public interface
        public Queues:IQueueServiceType;

        //Set messaging implementation
        private Setup():void {
            this.Queues = new Services.IQueueServiceType();

            //Set all queues
            this.SetupNextPageNotifications();
        }

        private SetupNextPageNotifications():void {
            var _this = this;
            var nextPageNotificationsQueueName = 'nextPageNotifications';

            this.Queues.NextPage.Notifications.add = function (message, severity) {
                _this.addToQueue(nextPageNotificationsQueueName, {
                    Message: message,
                    Severity: severity
                });
            };
            this.Queues.NextPage.Notifications.retrieveFirst = function () {
                return _this.retrieveMessageFromQueue(nextPageNotificationsQueueName, true);
            };
            this.Queues.NextPage.Notifications.retrieveLast = function () {
                return _this.retrieveMessageFromQueue(nextPageNotificationsQueueName, false);
            };
            this.Queues.NextPage.Notifications.retrieveAll = function () {
                return _this.retrieveAllMessagesFromQueue(nextPageNotificationsQueueName);
            };
        }
    }
}
