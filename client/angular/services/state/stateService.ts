/// <reference path="../../interfaces/services/state/IStateService.ts" />
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
                StateService
            ];
        }

        constructor(private MessagingService:Services.IMessagingService,
                    private DialogService:Services.IDialogService,
                    private RedirectService:Services.IRedirectService) {
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
            this.CurrentUserSession = userSession;
            if (!userSession) {
                //Invalidation
                this.MessagingService.Messages.User.LoggedOut.publish();
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

        public RegisterPostLoginAction(actionName:string, canCancel:boolean, action:()=>void):void {
            this.PostLoginActions.add({
                actionName: actionName,
                canCancel: canCancel,
                action: action
            });
        }

        private PostLoginHandler():void {
            var _this = this;
            if (this.PostLoginActions.length == 0) return;
            var postLoginActions:any[] = this.PostLoginActions.createCopy();
            this.PostLoginActions = [];

            //Assemble confirmation message
            var cancelableActionPredicate = function(item) {
                return item.canCancel;
            };
            var cancelableActions:any[] = postLoginActions.where(cancelableActionPredicate);
            var shouldCreateConfirmationDialog:boolean = cancelableActions && cancelableActions.length > 0;
            var executeActionConfirmationMessage = 'Retry pending actions?'; //TODO:

            //Execute actions
            if (!shouldCreateConfirmationDialog)this.ExecutePostLoginActions(postLoginActions, false);
            else this.DialogService.CreateConfirmationDialog(executeActionConfirmationMessage, function (result:boolean) {
                _this.ExecutePostLoginActions(postLoginActions, result);

                //Start with new screen
                if (!result) _this.RedirectService.RedirectToHomeScreen();
            });
        }

        private ExecutePostLoginActions(postLoginActions:any[], executeCancelable:boolean):void {
            //Execute pending actions
            for (var i = 0; i < postLoginActions.length; i++) {
                var postLoginAction = postLoginActions[i];
                var actionFn = postLoginAction.action;
                var canCancel:boolean = postLoginAction.canCancel;
                if (!canCancel || executeCancelable) actionFn();
            }
        }
    }
}
