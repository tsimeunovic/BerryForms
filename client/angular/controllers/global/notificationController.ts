/// <reference path="./../base/baseController.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../../interfaces/services/interaction/INotificationService.ts" />
/// <reference path="../../../config/config.ts" />
/// <reference path="../../../extensions/dateExtensions.ts" />
/// <reference path="../../../extensions/stringExtensions.ts" />

'use strict';

//Controller responsible for front end notifications
module Controllers {
    export class NotificationController extends BaseController {
        public static injection():any[] {
            return [
                '$scope',
                'toaster',
                'toasterConfig',
                'MessagingService',
                'LocalizationService',
                NotificationController
            ];
        }

        constructor(Scope:any,
                    private Toaster:any,
                    private ToasterConfig:any,
                    private MessagingService:Services.IMessagingService,
                    private LocalizationService:Services.ILocalizationService) {
            super(Scope);
            this.ConfigureToastr();
            this.Initialize();
        }

        private Initialize():void {
            this.AddSubscription(this.MessagingService.Messages.Notification.Message.subscribe(this.NotificationMessageReceived.bind(this)));
        }

        private ConfigureToastr():void {
            this.ToasterConfig['close-button'] = true;
            this.ToasterConfig['time-out'] = Config.Client.NotificationDisplayTimeMs;
            this.ToasterConfig['position-class'] = 'toast-bottom-full-width';
        }

        private NotificationMessageReceived(notification:any):void {
            var datetime = (new Date()).format('dd.MM.yyyy HH:mm:ss');
            var severity:string;
            switch (notification.Severity) {
                case Services.NotificationSeverity.Error:
                    severity = this.LocalizationService.Resources.Error;
                    this.Toaster.pop('error', null, notification.Message);
                    break;
                case Services.NotificationSeverity.Warning:
                    severity = this.LocalizationService.Resources.Warning;
                    this.Toaster.pop('warning', null, notification.Message);
                    break;
                case Services.NotificationSeverity.Information:
                    severity = this.LocalizationService.Resources.Information;
                    this.Toaster.pop('info', null, notification.Message);
                    break;
                case Services.NotificationSeverity.Success:
                    severity = this.LocalizationService.Resources.Success;
                    this.Toaster.pop('success', null, notification.Message);
                    break;
                default:
                    throw new Error();
            }
            var consoleOutput:string = ('{0} - {1}: {2}').format([datetime, severity, notification.Message]);
            console.log(consoleOutput);
        }
    }
}
