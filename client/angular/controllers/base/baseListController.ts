/// <reference path="../base/baseViewController.ts" />
/// <reference path="../../interfaces/services/communication/IQueueService.ts" />
/// <reference path="../../interfaces/services/interaction/INotificationService.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../../interfaces/services/state/IStateService.ts" />
/// <reference path="../../../static/controllerArea.ts" />

//Base controllers for all list views
module Controllers {
    'use strict';

    export class BaseListController extends BaseViewController {
        constructor(Scope:any,
                    ControllerArea:Static.ControllerArea,
                    MessagingService:Services.IMessagingService,
                    NotificationService:Services.INotificationService,
                    QueueService:Services.IQueueService,
                    StateService:Services.IStateService) {
            super(Scope, ControllerArea, MessagingService, NotificationService, QueueService, StateService);
            this.SetupBaseListController();
        }

        private SetupBaseListController():void {
            this.Scope.SortListeners = {};
            this.Scope.SortListeners.orderChanged = this.ListItemOrderChanged.bind(this);
        }

        private ListItemOrderChanged(event:any):void {
            var newIndex:number = event.dest.index;
            var oldIndex:number = event.source.index;

            //Update on server
            if (this.Scope.OriginalMetadata) {
                this.Scope.OriginalMetadata.Fields.move(oldIndex, newIndex);
                this.Scope.SaveEntityMetadata(this.Scope.OriginalMetadata);
            }
        }
    }
}
