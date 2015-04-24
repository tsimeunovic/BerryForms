/// <reference path="../base/baseController.ts" />
/// <reference path="../base/baseViewController.ts" />
/// <reference path="../../interfaces/services/repository/IDashboardRepositoryService.ts" />
/// <reference path="../../interfaces/services/localization/ILocalizationService.ts" />
/// <reference path="../../../static/routeParams.ts" />
/// <reference path="../../../extensions/stringExtensions.ts" />

'use strict';

//Controller for dashboard activity list component (display recently active records as a list)
module Controllers {
    export class DashboardActivityListController extends BaseViewController {
        public static injection():any[] {
            return [
                '$scope',
                '$routeParams',
                'MessagingService',
                'NotificationService',
                'QueueService',
                'StateService',
                'LocalizationService',
                'DashboardRepositoryService',
                DashboardActivityListController
            ]
        }

        constructor(Scope:any,
                    RouteParams:any,
                    MessagingService:Services.IMessagingService,
                    NotificationService:Services.INotificationService,
                    QueueService:Services.IQueueService,
                    StateService:Services.IStateService,
                    private LocalizationService:Services.ILocalizationService,
                    private DashboardRepositoryService:Services.IDashboardRepositoryService) {
            super(Scope, Static.ControllerArea.Dashboard, MessagingService, NotificationService, QueueService, StateService);
            var entityName:string = RouteParams[Static.RouteParams.EntityName];

            this.EntityName = entityName;

            this.InitializeScope();
        }

        private EntityName:string;

        private InitializeScope():void {
            this.Scope.NoRecentActivityMessage = this.LocalizationService.Resources.NoRecentActivity;
            this.Scope.ActivityLists = [
                {
                    Title: this.LocalizationService.Resources.RecentlyModifiedRecordsByMe,
                    Type: 'me'
                },
                {
                    Title: this.LocalizationService.Resources.RecentlyModifiedRecords,
                    Type: 'all'
                }
            ];

            //Load activity lists
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.DashboardActivity);
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.DashboardMyActivity);
            this.DashboardRepositoryService.GetMyRecentActivity(this.EntityName, this.MyRecentActivityLoaded.bind(this));
            this.DashboardRepositoryService.GetRecentActivity(this.EntityName, this.RecentActivityLoaded.bind(this));
        }

        private MyRecentActivityLoaded(activityItems:any[], errorsModel:any):void {
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.DashboardMyActivity);
            if (errorsModel == null) {
                this.Scope.ActivityLists[0].Items = activityItems;
            }
            else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }

        private RecentActivityLoaded(activityItems:any[], errorsModel:any):void {
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.DashboardActivity);
            if (errorsModel == null) {
                this.Scope.ActivityLists[1].Items = activityItems;
            }
            else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }
    }
}