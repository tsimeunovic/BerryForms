/// <reference path="../../../../static/notificationSeverity.ts" />

//Interface for Notification service (frontend UI notifications for user)
module Services {
    'use strict';

    export interface INotificationService {
        NotifyMessage(message:string, severity:Static.NotificationSeverity):void;
        Notify(key:string, args:string[], severity:Static.NotificationSeverity):void;
        HandleErrorsModel(errorsModel:any):void;
    }
}
