/// <reference path="../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../interfaces/services/interaction/INotificationService.ts" />
/// <reference path="../interfaces/localization/IResources.ts" />
/// <reference path="../../static/notificationSeverity.ts" />

var _global:any = this;

//Interceptor that takes care of unhandled exceptions
module Interceptors {
    'use strict';

    export class ExceptionHandler {
        private static Log:any;

        //@ngInject
        public static FactoryRegistration($log:any):(exception:any) => void {
            ExceptionHandler.Log = $log;
            return ExceptionHandler.HandleUncaughtError;
        }

        private static HandleUncaughtError(exception:any):void {
            //Log error to console
            ExceptionHandler.Log.error(exception);

            //Display notification
            var messages:Services.IMessagingServiceType = _global.Instances &&
                _global.Instances.MessagingService &&
                _global.Instances.MessagingService.Messages;
            var resources:Localization.IResources = _global.Localization.Resources;
            if (messages && resources) {
                messages.Notification.Message.publish(resources.UnknownError, Static.NotificationSeverity.Error);
            }
        }
    }
}
