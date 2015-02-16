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
                LoginController
            ];
        }

        constructor(Scope:any,
                    private MessagingService:Services.IMessagingService,
                    private StateService:Services.IStateService,
                    private DialogService:Services.IDialogService) {
            super(Scope);
            this.MessagingService.Messages.User.LoggedIn.subscribe(this.LoggedInUserChanged.bind(this));
            this.MessagingService.Messages.User.LoggedOut.subscribe(this.LoggedInUserChanged.bind(this));
            this.LoggedInUserChanged();

            //Temporary test
            this.AutoLogin();
        }

        private LoggedInUserChanged():void {
            var currentSession = this.StateService.GetCurrentUserSession();
            if (!currentSession) this.DialogService.RemoveDialog();
            this.Scope.LoggedInUser = !!currentSession;
        }

        //Temporary test
        private AutoLogin():void {
            var _this = this;
            setTimeout(function () {
                _this.Scope.$apply(function () {
                    var mockSession:Models.UserSession = new Models.UserSession();
                    mockSession.User = new Models.User();
                    mockSession.User.UserName = 'test';
                    mockSession.ValidTo = (new Date()).getTime() + 1000 * 60 * 30;
                    mockSession.Token = '8d00257b-f76d-4c74-9215-7b14df9f4cb5';
                    _this.StateService.SetCurrentUserSession(mockSession);
                });
            }, 2000);
        }
    }
}