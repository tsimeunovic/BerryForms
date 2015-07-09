/// <reference path="../base/baseController.ts" />
/// <reference path="../../data/createLoginFormFields.ts" />
/// <reference path="../../interfaces/services/state/IStateService.ts" />
/// <reference path="../../interfaces/services/interaction/IDialogService.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../../interfaces/services/repository/IUserRepositoryService.ts" />

//Controller for login screen
module Controllers {
    'use strict';

    export class LoginController extends BaseController {
        //@ngInject
        constructor($scope:any,
                    private MessagingService:Services.IMessagingService,
                    private StateService:Services.IStateService,
                    private DialogService:Services.IDialogService,
                    private LocalizationService:Services.ILocalizationService,
                    private UserRepositoryService:Services.IUserRepositoryService,
                    private NotificationService:Services.INotificationService) {
            super($scope);
            this.MessagingService.Messages.User.LoggedIn.subscribe(this.LoggedInUserChanged.bind(this));
            this.MessagingService.Messages.User.LoggedOut.subscribe(this.LoggedInUserChanged.bind(this));
            this.LoggedInUserChanged(null);
        }

        private LoggedInUserChanged(userSession:Models.UserSession):void {
            var currentSession:Models.UserSession = this.StateService.GetCurrentUserSession();
            if (!currentSession) {
                this.DialogService.RemoveDialog();
            }
            this.InitializeScope(userSession && userSession.User.UserName);
            this.Scope.LoggedInUser = !!currentSession;
        }

        private InitializeScope(preFilledUserName:string):void {
            this.Scope.Login = this.Login.bind(this);
            this.Scope.LoginInProgress = false;
            this.Scope.LoginHeader = this.LocalizationService.Resources.Login;
            this.Scope.LoginButtonText = this.LocalizationService.Resources.Login;
            this.Scope.EntityMetadata = Data.CreateLoginFormFields.GetData();
            this.Scope.Entity = new Models.Entity(this.Scope.EntityMetadata.EntitySystemName);

            //Fill model
            this.Scope.Entity.Data.StayLoggedIn = false;
            if (preFilledUserName) {
                this.Scope.Entity.Data.UserName = preFilledUserName;
            }
        }

        private Login():void {
            var userName:string = this.Scope.Entity.Data.UserName;
            var password:string = this.Scope.Entity.Data.Password;
            var stayLoggedIn:boolean = this.Scope.Entity.Data.StayLoggedIn;
            this.Scope.LoginInProgress = true;
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.LoggingIn);
            this.UserRepositoryService.LoginUser(userName, password, stayLoggedIn, this.LoginCompleted.bind(this));
        }

        private LoginCompleted(session:Models.UserSession, errorsModel:any):void {
            this.Scope.LoginInProgress = false;
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.LoggingIn);
            if (errorsModel === null) {
                this.StateService.SetCurrentUserSession(session);
            } else {
                this.Scope.Entity.Data.Password = null;
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }
    }
}
