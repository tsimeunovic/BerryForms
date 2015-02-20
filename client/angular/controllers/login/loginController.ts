/// <reference path="../base/baseController.ts" />
/// <reference path="../../services/state/stateService.ts" />
/// <reference path="../../services/communication/messagingService.ts" />

'use strict';

//Controller for login screen
module Controllers {
    export class LoginController extends BaseController {
        public static injection():any[] {
            return [
                '$scope',
                'MessagingService',
                'StateService',
                'DialogService',
                'LocalizationService',
                'UserRepositoryService',
                'NotificationService',
                LoginController
            ];
        }

        constructor(Scope:any,
                    private MessagingService:Services.IMessagingService,
                    private StateService:Services.IStateService,
                    private DialogService:Services.IDialogService,
                    private LocalizationService:Services.ILocalizationService,
                    private UserRepositoryService:Services.IUserRepositoryService,
                    private NotificationService:Services.INotificationService) {
            super(Scope);
            this.MessagingService.Messages.User.LoggedIn.subscribe(this.LoggedInUserChanged.bind(this));
            this.MessagingService.Messages.User.LoggedOut.subscribe(this.LoggedInUserChanged.bind(this));
            this.LoggedInUserChanged(null);
        }

        private LoggedInUserChanged(userSession:Models.UserSession):void {
            var currentSession = this.StateService.GetCurrentUserSession();
            if (!currentSession) this.DialogService.RemoveDialog();
            this.InitializeScope(userSession && userSession.User.UserName);
            this.Scope.LoggedInUser = !!currentSession;
        }

        private InitializeScope(prefilledUserName:string):void {
            this.Scope.Login = this.Login.bind(this);
            this.Scope.LoginInProgress = false;
            this.Scope.LoginHeader = this.LocalizationService.Resources.Login;
            this.Scope.LoginButtonText = this.LocalizationService.Resources.Login;
            this.Scope.EntityMetadata = Data.CreateLoginFormFields.GetData();
            this.Scope.Entity = new Models.Entity(this.Scope.EntityMetadata.EntitySystemName);
            if (prefilledUserName) this.Scope.Entity.Data['UserName'] = prefilledUserName;
        }

        private Login():void {
            var userName:string = this.Scope.Entity.Data['UserName'];
            var password:string = this.Scope.Entity.Data['Password'];
            this.Scope.LoginInProgress = true;
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.LoggingIn);
            this.UserRepositoryService.LoginUser(userName, password, this.LoginCompleted.bind(this));
        }

        private LoginCompleted(session:Models.UserSession, errorsModel:any):void {
            this.Scope.LoginInProgress = false;
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.LoggingIn);
            if (errorsModel == null) this.StateService.SetCurrentUserSession(session);
            else {
                this.Scope.Entity.Data['Password'] = null;
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }
    }
}