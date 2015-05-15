/// <reference path="./queueBaseService.ts" />
/// <reference path="../../interfaces/services/communication/IQueueService.ts" />

//Service that provides named queues and methods to add and withdraw messages from them
module Services {
    'use strict';

    export class QueueService extends QueueBaseService implements Services.IQueueService {
        /* tslint:disable:member-ordering */
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
            var _this:QueueService = this;
            var nextPageNotificationsQueueName:string = 'nextPageNotifications';

            this.Queues.NextPage.Notifications.add = function (message:string, severity:Services.NotificationSeverity):void {
                _this.addToQueue(nextPageNotificationsQueueName, {
                    Message: message,
                    Severity: severity
                });
            };
            this.Queues.NextPage.Notifications.retrieveFirst = function ():any {
                return _this.retrieveMessageFromQueue(nextPageNotificationsQueueName, true);
            };
            this.Queues.NextPage.Notifications.retrieveLast = function ():any {
                return _this.retrieveMessageFromQueue(nextPageNotificationsQueueName, false);
            };
            this.Queues.NextPage.Notifications.retrieveAll = function ():any[] {
                return _this.retrieveAllMessagesFromQueue(nextPageNotificationsQueueName);
            };
        }
    }
}
