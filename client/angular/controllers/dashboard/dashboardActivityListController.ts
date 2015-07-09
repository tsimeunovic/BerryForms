/// <reference path="../base/baseController.ts" />
/// <reference path="../base/baseViewController.ts" />
/// <reference path="../../interfaces/services/repository/IDashboardRepositoryService.ts" />
/// <reference path="../../interfaces/services/localization/ILocalizationService.ts" />
/// <reference path="../../../static/routeParams.ts" />
/// <reference path="../../../extensions/stringExtensions.ts" />

//Controller for dashboard activity list component (display last active records as a list)
module Controllers {
    'use strict';

    export class DashboardActivityListController extends BaseViewController {
        //@ngInject
        constructor($scope:any,
                    $routeParams:any,
                    MessagingService:Services.IMessagingService,
                    NotificationService:Services.INotificationService,
                    QueueService:Services.IQueueService,
                    StateService:Services.IStateService,
                    private LocalizationService:Services.ILocalizationService,
                    private DashboardRepositoryService:Services.IDashboardRepositoryService) {
            super($scope, Static.ControllerArea.Dashboard, MessagingService, NotificationService, QueueService, StateService);
            this.EntityName = $routeParams[Static.RouteParams.EntityName];
            this.InitializeScope();
        }

        private EntityName:string;

        private InitializeScope():void {
            this.Scope.NoRecentActivityMessage = this.LocalizationService.Resources.NoRecentActivity;
            this.Scope.ActivityLists = [
                {
                    Title: this.LocalizationService.Resources.LastModifiedRecordsByMe,
                    Type: 'me'
                },
                {
                    Title: this.LocalizationService.Resources.LastModifiedRecords,
                    Type: 'all'
                }
            ];

            //Load activity lists
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.DashboardMyActivity);
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.DashboardActivity);
            this.DashboardRepositoryService.GetMyLastActivity(this.EntityName, this.MyLastActivityLoaded.bind(this));
            this.DashboardRepositoryService.GetLastActivity(this.EntityName, this.LastActivityLoaded.bind(this));
        }

        private MyLastActivityLoaded(activityItems:any[], errorsModel:any):void {
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.DashboardMyActivity);
            if (errorsModel === null) {
                this.Scope.ActivityLists[0].Items = activityItems;
            } else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }

        private LastActivityLoaded(activityItems:any[], errorsModel:any):void {
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.DashboardActivity);
            if (errorsModel === null) {
                this.Scope.ActivityLists[1].Items = activityItems;
            } else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }
    }
}
