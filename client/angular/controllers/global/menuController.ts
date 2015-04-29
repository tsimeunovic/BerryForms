/// <reference path="../base/baseController.ts" />
/// <reference path="../../interfaces/services/state/IEntityMetadataListCacheService.ts" />
/// <reference path="../../interfaces/services/localization/ILocalizationService.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../../interfaces/services/interaction/INotificationService.ts" />

'use strict';

//Controller for left (top for mobile devices) menu
module Controllers {
    export class MenuController extends BaseController {
        public static injection():any[] {
            return [
                '$scope',
                'MessagingService',
                'EntityMetadataListCacheService',
                'LocalizationService',
                'NotificationService',
                MenuController
            ];
        }

        constructor(Scope:any,
                    private MessagingService:Services.IMessagingService,
                    private EntityMetadataListCacheService:Services.IEntityMetadataListCacheService,
                    private LocalizationService:Services.ILocalizationService,
                    private NotificationService:Services.INotificationService) {
            super(Scope);
            this.InitializeScope();
        }

        private InitializeScope():void {
            this.Scope.CreateNewEntityTitle = this.LocalizationService.Resources.CreateNewEntity;

            this.RetrieveDataFromEntityMetadataCache();
            this.WatchEntityMetadataCache();
        }

        private RetrieveDataFromEntityMetadataCache():void{
            this.Scope.Entities = this.EntityMetadataListCacheService.Data;
        }

        private WatchEntityMetadataCache():void {
            this.AddSubscription(this.MessagingService.Messages.Cache.MetadataList.Loaded.subscribe(this.RetrieveDataFromEntityMetadataCache.bind(this)));
        }
    }
}
