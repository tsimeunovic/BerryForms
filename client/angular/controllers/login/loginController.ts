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

        public LoggedInUser:boolean;
        public LoginInProgress:boolean;
        public LoginHeader:string;
        public LoginButtonText:string;
        public EntityMetadata:Models.EntityMetadata;
        public Entity:Models.Entity;

        public Login():void {
            var userName:string = this.Entity.Data.UserName;
            var password:string = this.Entity.Data.Password;
            var stayLoggedIn:boolean = this.Entity.Data.StayLoggedIn;
            this.LoginInProgress = true;
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.LoggingIn);
            this.UserRepositoryService.LoginUser(userName, password, stayLoggedIn, this.LoginCompleted.bind(this));
        }

        private LoggedInUserChanged(userSession:Models.UserSession):void {
            var currentSession:Models.UserSession = this.StateService.GetCurrentUserSession();
            if (!currentSession) {
                this.DialogService.RemoveDialog();
            }
            this.Initialize(userSession && userSession.User.UserName);
            this.LoggedInUser = !!currentSession;
        }

        private Initialize(preFilledUserName:string):void {
            this.LoginInProgress = false;
            this.LoginHeader = this.LocalizationService.Resources.Login;
            this.LoginButtonText = this.LocalizationService.Resources.Login;
            this.EntityMetadata = Data.CreateLoginFormFields.GetData();
            this.Entity = new Models.Entity(this.EntityMetadata.EntitySystemName);

            //Fill model
            this.Entity.Data.StayLoggedIn = false;
            if (preFilledUserName) {
                this.Entity.Data.UserName = preFilledUserName;
            }
        }

        private LoginCompleted(session:Models.UserSession, errorsModel:any):void {
            this.LoginInProgress = false;
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.LoggingIn);
            if (errorsModel === null) {
                this.StateService.SetCurrentUserSession(session);
            } else {
                this.Entity.Data.Password = null;
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }
    }
}
