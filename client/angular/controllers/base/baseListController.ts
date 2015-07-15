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

        public OriginalMetadata:Models.EntityMetadata;
        public SaveChangesHandler:(entityMetadata:Models.EntityMetadata) => void;
        public SortListener:any;

        private SetupBaseListController():void {
            this.SortListener = {};
            this.SortListener.orderChanged = this.ListItemOrderChanged.bind(this);
        }

        private ListItemOrderChanged(event:any):void {
            var newIndex:number = event.dest.index;
            var oldIndex:number = event.source.index;

            //Change items and save changes
            if (this.OriginalMetadata) {
                this.OriginalMetadata.Fields.move(oldIndex, newIndex);
                if (this.SaveChangesHandler) {
                    this.SaveChangesHandler(this.OriginalMetadata);
                }
            }
        }
    }
}
