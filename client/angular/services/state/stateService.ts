/// <reference path="../../interfaces/services/state/IStateService.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../../interfaces/services/interaction/IDialogService.ts" />
/// <reference path="../../interfaces/services/system/IRedirectService.ts" />
/// <reference path="../../interfaces/services/localization/ILocalizationService.ts" />
/// <reference path="../../models/core/entityModel.ts" />
/// <reference path="../../../extensions/arrayExtensions.ts" />

'use strict';

//Stores the state of application for scenarios when it should be preserved (for example page switch while editing)
module Services {
    export class StateService implements Services.IStateService {
        public static injection():any[] {
            return [
                'MessagingService',
                'DialogService',
                'RedirectService',
                'LocalizationService',
                StateService
            ];
        }

        constructor(private MessagingService:Services.IMessagingService,
                    private DialogService:Services.IDialogService,
                    private RedirectService:Services.IRedirectService,
                    private LocalizationService:Services.ILocalizationService) {
            this.EditedEntity = null;
            this.CurrentUserSession = null;
            this.PostLoginActions = [];
        }

        private EditedEntity:Models.Entity;
        private CurrentUserSession:Models.UserSession;
        private PostLoginActions:any[];

        public SetEditedEntity(entity:Models.Entity):void {
            this.EditedEntity = entity;
        }

        public GetEditedEntity(entityName:string, entityId:number):Models.Entity {
            if (!this.EditedEntity ||
                this.EditedEntity.EntitySystemName != entityName ||
                this.EditedEntity.Id != entityId) {
                this.EditedEntity = null;
            }
            return this.EditedEntity;
        }

        public SetCurrentUserSession(userSession:Models.UserSession):void {
            var previousSession = this.CurrentUserSession;
            this.CurrentUserSession = userSession;
            if (!userSession) {
                //Invalidation
                this.MessagingService.Messages.User.LoggedOut.publish(previousSession);
            }
            else {
                //New login
                this.MessagingService.Messages.User.LoggedIn.publish(userSession);
                this.PostLoginHandler();
            }
        }

        public GetCurrentUserSession():Models.UserSession {
            return this.CurrentUserSession;
        }

        public UpdateCurrentUserSession(validTo:number, token:string):void {
            var currentSession = this.CurrentUserSession;
            if (currentSession && currentSession.ValidTo < validTo) {
                currentSession.ValidTo = validTo;
                currentSession.Token = token;
            }
        }

        public RegisterPostLoginAction(actionName:string, canCancel:boolean, action:()=>void, cancel:()=>void):void {
            var currentUserSession = this.CurrentUserSession;
            this.PostLoginActions.add({
                registeringUser: currentUserSession && currentUserSession.User.UserName,
                actionName: actionName,
                canCancel: canCancel,
                action: action,
                cancel: cancel
            });
        }

        private PostLoginHandler():void {
            var _this = this;
            var currentUserSession = this.CurrentUserSession;

            var userPostLoginActionPredicate = function (item) {
                return !item.registeringUser || item.registeringUser == currentUserSession.User.UserName;
            };
            var cancelableActionPredicate = function (item) {
                return item.canCancel;
            };

            var userPostLoginActions:any[] = this.PostLoginActions.where(userPostLoginActionPredicate);
            this.PostLoginActions = [];
            if (userPostLoginActions.length == 0) return;

            //Assemble confirmation message
            var cancelableActions:any[] = userPostLoginActions.where(cancelableActionPredicate);
            var shouldCreateConfirmationDialog:boolean = cancelableActions && cancelableActions.length > 0;

            //Execute actions
            if (!shouldCreateConfirmationDialog) {
                this.ExecutePostLoginActions(userPostLoginActions, false);
            }
            else {
                var clientReadableActionsList:string[] = this.CreateClientReadableActionsList(cancelableActions);
                this.DialogService.CreateConfirmationDialog(clientReadableActionsList, function (result:boolean) {
                    _this.ExecutePostLoginActions(userPostLoginActions, result);

                    //Start with new screen
                    if (!result) _this.RedirectService.RedirectToHomeScreen();
                });
            }
        }

        private CreateClientReadableActionsList(cancelableActions:any[]):string[] {
            var result = [this.LocalizationService.Resources.RetryActionsQuestion];
            for (var i = 0; i < cancelableActions.length; i++) {
                var action = cancelableActions[i];
                result.push(this.LocalizationService.GetResourceByKey(action.actionName, null));
            }
            return result;
        }

        private ExecutePostLoginActions(postLoginActions:any[], executeCancelable:boolean):void {
            //Execute pending actions
            for (var i = 0; i < postLoginActions.length; i++) {
                var postLoginAction = postLoginActions[i];
                var actionFn = postLoginAction.action;
                var cancelFn = postLoginAction.cancel;
                var canCancel:boolean = postLoginAction.canCancel;
                if (!canCancel || executeCancelable) actionFn();
                else cancelFn();
            }
        }
    }
}
