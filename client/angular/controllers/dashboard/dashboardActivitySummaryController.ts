/// <reference path="../base/baseController.ts" />
/// <reference path="../base/baseViewController.ts" />
/// <reference path="../../interfaces/services/repository/IDashboardRepositoryService.ts" />
/// <reference path="../../interfaces/services/state/IEntityMetadataListCacheService.ts" />
/// <reference path="../../interfaces/services/localization/ILocalizationService.ts" />
/// <reference path="../../interfaces/services/system/IRedirectService.ts" />
/// <reference path="../../../static/routeParams.ts" />
/// <reference path="../../../extensions/stringExtensions.ts" />

'use strict';

//Controller for dashboard activity summary component (display graph with activity summary per entity)
module Controllers {
    export class DashboardActivitySummaryController extends BaseViewController {
        public static injection():any[] {
            return [
                '$scope',
                '$routeParams',
                'MessagingService',
                'NotificationService',
                'QueueService',
                'StateService',
                'EntityMetadataListCacheService',
                'LocalizationService',
                'RedirectService',
                'DashboardRepositoryService',
                DashboardActivitySummaryController
            ]
        }

        constructor(Scope:any,
                    RouteParams:any,
                    MessagingService:Services.IMessagingService,
                    NotificationService:Services.INotificationService,
                    QueueService:Services.IQueueService,
                    StateService:Services.IStateService,
                    private EntityMetadataListCacheService:Services.IEntityMetadataListCacheService,
                    private LocalizationService:Services.ILocalizationService,
                    private RedirectService:Services.IRedirectService,
                    private DashboardRepositoryService:Services.IDashboardRepositoryService) {
            super(Scope, Static.ControllerArea.Dashboard, MessagingService, NotificationService, QueueService, StateService);
            var entityName:string = RouteParams[Static.RouteParams.EntityName];

            this.EntityName = entityName;

            this.InitializeScope();
        }

        private EntityName:string;

        private InitializeScope():void {
            //Header
            if (this.EntityName) {
                this.LoadEntityMetadata();
            }
            else {
                this.Scope.FormHeader = this.LocalizationService.Resources.Dashboard;
                this.Scope.RecentActivityHeader = this.LocalizationService.Resources.RecentActivity;
            }

            //Data
            this.LoadDashboardData();
        }

        private LoadEntityMetadata():void {
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.EntityData);
            this.EntityMetadataListCacheService.LoadEntityMetadataFromCache(this.EntityName, this.LoadEntityMetadataCompleted.bind(this));
        }

        private LoadEntityMetadataCompleted(metadata:Models.EntityMetadata, errorsModel:any):void {
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.EntityData);
            if (errorsModel == null) {
                //Non existing or empty entity
                if (!metadata) {
                    this.RedirectService.RedirectToCreateEntitySchema();
                    return;
                }

                this.Scope.EntityMetadata = metadata;
                this.Scope.FormHeader = this.LocalizationService.Resources.DashboardFor.format([metadata.EntityName]);
            }
            else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }

        private LoadDashboardData():void {
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.DashboardSummary);
            this.DashboardRepositoryService.GetActivitySummary(this.EntityName, this.ActivitySummaryLoaded.bind(this));
        }

        private ActivitySummaryLoaded(activityData:any[], errorsModel:any):void {
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.DashboardSummary);
            if (errorsModel == null) {
                this.Scope.NoRecentActivityMessage = this.LocalizationService.Resources.NoRecentActivity;
                this.Scope.ActivitySummary = activityData;
            }
            else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }
    }
}
