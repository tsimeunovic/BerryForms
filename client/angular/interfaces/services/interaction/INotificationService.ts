'use strict';

//Interface for Notification service (frontend UI notifications for user)
module Services {
    export interface INotificationService {
        NotifyMessage(message:string, severity:Services.NotificationSeverity):void;
        Notify(key:string, args:string[], severity:Services.NotificationSeverity):void;
        HandleErrorsModel(errorsModel:any):void;
    }

    export enum NotificationSeverity {
        Error,
        Warning,
        Information,
        Success
    }
}
