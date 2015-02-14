/// <reference path="../interaction/INotificationService.ts" />

'use strict';

//Interface for Queue service (has named queues where components can store/withdraw messages)
module Services {
    //Defined queues
    export class IQueueServiceType {
        public NextPage = {
            Notifications: {
                add: function (message:string, severity:Services.NotificationSeverity):void { throw new Error(); },
                retrieveFirst: function ():any { throw new Error(); },
                retrieveLast: function ():any { throw new Error(); },
                retrieveAll: function ():any[] { throw new Error(); }
            }
        };
    }

    //Queue service contract
    export interface IQueueService {
        Queues: IQueueServiceType;
    }
}