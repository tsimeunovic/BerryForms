/// <reference path="./../base/baseController.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../../../static/loadingType.ts" />
/// <reference path="../../../extensions/arrayExtensions.ts" />

'use strict';

//Controller responsible for showing loading indicator
module Controllers {
    export class LoadingController extends BaseController {
        public static injection():any[] {
            return [
                '$scope',
                'MessagingService',
                LoadingController
            ];
        }

        constructor(Scope:any,
                    private MessagingService:Services.IMessagingService) {
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
        }

        private LoadingStarted(task:Static.LoadingType):void {
            //Add new task to list
            var index = this.TasksInProgress.indexOf(task);
            if (index < 0) this.TasksInProgress.add(task);
            this.SetLoadingState();
        }

        private LoadingFinished(task:Static.LoadingType):void {
            //Remove existing task from list
            var index = this.TasksInProgress.indexOf(task);
            if (index >= 0) this.TasksInProgress.remove(task);
            this.SetLoadingState();
        }

        private LoadingReset():void {
            this.TasksInProgress = [];
            this.SetLoadingState();
        }

        private SetLoadingState():void {
            this.Scope.LoadingInProgress = this.TasksInProgress.length > 0;
        }
    }
}