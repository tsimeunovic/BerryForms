/// <reference path="../base/baseController.ts" />
/// <reference path="../../interfaces/services/state/IEntityMetadataListCacheService.ts" />
/// <reference path="../../interfaces/services/localization/ILocalizationService.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../../interfaces/services/interaction/INotificationService.ts" />

//Controller for left (top for mobile devices) menu
module Controllers {
    'use strict';

    export class MenuController extends BaseController {
        //@ngInject
        constructor($scope:any,
                    private MessagingService:Services.IMessagingService,
                    private EntityMetadataListCacheService:Services.IEntityMetadataListCacheService,
                    private LocalizationService:Services.ILocalizationService) {
            super($scope);
            this.InitializeScope();
        }

        public InitializeScope():void {
            this.Scope.CreateNewEntityTitle = this.LocalizationService.Resources.CreateNewEntity;

            this.RetrieveDataFromEntityMetadataCache();
            this.WatchEntityMetadataCache();
        }

        private RetrieveDataFromEntityMetadataCache():void {
            this.Scope.Entities = this.EntityMetadataListCacheService.Data;
        }

        private WatchEntityMetadataCache():void {
            this.AddSubscription(this.MessagingService.Messages.Cache.MetadataList.Loaded.subscribe(this.RetrieveDataFromEntityMetadataCache.bind(this)));
        }
    }
}
