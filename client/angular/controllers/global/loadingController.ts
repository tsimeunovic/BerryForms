/// <reference path="./../base/baseController.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../../interfaces/services/state/IStateService.ts" />
/// <reference path="../../models/security/userSessionModel.ts" />
/// <reference path="../../../static/loadingType.ts" />
/// <reference path="../../../extensions/arrayExtensions.ts" />

//Controller responsible for showing loading indicator
module Controllers {
    'use strict';

    export class LoadingController extends BaseController {
        /* tslint:disable:member-ordering */
        public static injection():any[] {
            return [
                '$scope',
                'MessagingService',
                'StateService',
                LoadingController
            ];
        }

        constructor(Scope:any,
                    private MessagingService:Services.IMessagingService,
                    private StateService:Services.IStateService) {
            super(Scope);
            this.Initialize();
        }

        private TasksInProgress:Static.LoadingType[];

        private Initialize():void {
            this.TasksInProgress = [];
            this.SetLoadingState();

            this.AddSubscription(this.MessagingService.Messages.Loading.Started.subscribe(this.LoadingStarted.bind(this)));
            this.AddSubscription(this.MessagingService.Messages.Loading.Finished.subscribe(this.LoadingFinished.bind(this)));
            this.AddSubscription(this.MessagingService.Messages.Loading.Reset.subscribe(this.LoadingReset.bind(this)));
            this.AddSubscription(this.MessagingService.Messages.User.LoggedOut.subscribe(this.SetLoadingState.bind(this)));
            this.AddSubscription(this.MessagingService.Messages.User.LoggedIn.subscribe(this.SetLoadingState.bind(this)));
        }

        private LoadingStarted(task:Static.LoadingType):void {
            //Add new task to list
            var index:number = this.TasksInProgress.indexOf(task);
            if (index < 0) {
                this.TasksInProgress.add(task);
            }
            this.SetLoadingState();
        }

        private LoadingFinished(task:Static.LoadingType):void {
            //Remove existing task from list
            var index:number = this.TasksInProgress.indexOf(task);
            if (index >= 0) {
                this.TasksInProgress.remove(task);
            }
            this.SetLoadingState();
        }

        private LoadingReset():void {
            this.TasksInProgress = [];
            this.SetLoadingState();
        }

        private SetLoadingState():void {
            var userSession:Models.UserSession = this.StateService.GetCurrentUserSession();
            var loginActive:boolean = !userSession;
            var loginTask:boolean = this.TasksInProgress.contains(Static.LoadingType.LoggingIn);
            var anyTask:boolean = this.TasksInProgress.length > 0;
            this.Scope.LoadingInProgress = (!loginActive && anyTask) || (loginActive && loginTask);
        }
    }
}
