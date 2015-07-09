/// <reference path="../../interfaces/services/localization/ILocalizationService.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../../interfaces/services/interaction/INotificationService.ts" />

//Service responsible for frontend UI notifications for user
module Services {
    'use strict';

    export class NotificationService implements Services.INotificationService {
        //@ngInject
        constructor(private LocalizationService:Services.ILocalizationService,
                    private MessagingService:Services.IMessagingService) {
        }

        public NotifyMessage(message:string, severity:Static.NotificationSeverity):void {
            this.MessagingService.Messages.Notification.Message.publish(message, severity);
        }

        public Notify(key:string, args:string[], severity:Static.NotificationSeverity):void {
            var message:string = this.LocalizationService.GetResourceByKey(key, args);
            this.NotifyMessage(message, severity);
        }

        public HandleErrorsModel(errorsModel:any):void {
            if (errorsModel !== null && errorsModel.Type === 'Plugin') {
                this.NotifyMessage(errorsModel.PluginMessage, Static.NotificationSeverity.Warning);
            } else if (errorsModel != null && errorsModel.Type === 'Client') {
                for (var i:number = 0; i < errorsModel.Errors.length; i++) {
                    var error:any = errorsModel.Errors[i];
                    this.Notify(error.ErrorTypeKey, error.ErrorParameters, Static.NotificationSeverity.Error);
                }
            } else if (errorsModel !== null && errorsModel.Type === 'Cancellation') {
                //Do nothing
            } else {
                this.NotifyMessage(this.LocalizationService.Resources.UnknownError, Static.NotificationSeverity.Error);
            }
        }
    }
}
