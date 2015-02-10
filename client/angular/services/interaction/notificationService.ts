/// <reference path="../../interfaces/services/localization/ILocalizationService.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../../interfaces/services/interaction/INotificationService.ts" />

'use strict';

//Service responsible for frontend UI notifications for user
module Services {
    export class NotificationService implements Services.INotificationService {
        public static injection():any[] {
            return [
                'LocalizationService',
                'MessagingService',
                NotificationService
            ];
        }

        constructor(private LocalizationService:Services.ILocalizationService,
                    private MessagingService:Services.IMessagingService) {
        }

        public NotifyMessage(message:string, severity:Services.NotificationSeverity):void {
            this.MessagingService.Messages.Notification.Message.publish(message, severity);
        }

        public Notify(key:string, args:string[], severity:Services.NotificationSeverity):void {
            var message = this.LocalizationService.GetResourceByKey(key, args);
            this.NotifyMessage(message, severity);
        }

        public HandleErrorsModel(errorsModel:any):void {
            if (errorsModel != null && errorsModel.Type == 'Plugin') {
                this.NotifyMessage(errorsModel.PluginMessage, Services.NotificationSeverity.Warning);
            }
            else if (errorsModel != null && errorsModel.Type == 'Client') {
                for (var i = 0; i < errorsModel.Errors.length; i++) {
                    var error = errorsModel.Errors[i];
                    this.Notify(error.ErrorTypeKey, error.ErrorParameters, Services.NotificationSeverity.Error);
                }
            }
            else {
                this.NotifyMessage(this.LocalizationService.Resources.UnknownError, Services.NotificationSeverity.Error);
            }
        }
    }
}
