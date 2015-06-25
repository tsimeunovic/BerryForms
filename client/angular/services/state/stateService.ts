/// <reference path="../../interfaces/services/state/IStateService.ts" />
/// <reference path="../../interfaces/services/state/IPersistentStorageService.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../../interfaces/services/interaction/IDialogService.ts" />
/// <reference path="../../interfaces/services/system/IRedirectService.ts" />
/// <reference path="../../interfaces/services/localization/ILocalizationService.ts" />
/// <reference path="../../interfaces/services/plugins/IPluginsExecutorService.ts" />
/// <reference path="../../models/core/entityModel.ts" />
/// <reference path="../../../extensions/arrayExtensions.ts" />
/// <reference path="../../../static/pluginOperations.ts" />

//Stores the state of application for scenarios when it should be preserved after context switching (for example page switch while editing)
module Services {
    'use strict';

    export class StateService implements Services.IStateService {
        /* tslint:disable:member-ordering */
        public static injection():any[] {
            return [
                'MessagingService',
                'DialogService',
                'RedirectService',
                'LocalizationService',
                'PersistentStorageService',
                'PluginsExecutorService',
                StateService
            ];
        }

        constructor(private MessagingService:Services.IMessagingService,
                    private DialogService:Services.IDialogService,
                    private RedirectService:Services.IRedirectService,
                    private LocalizationService:Services.ILocalizationService,
                    private PersistentStorageService:Services.IPersistentStorageService,
                    private PluginsExecutorService:Services.IPluginsExecutorService) {
            this.EditedEntity = null;
            this.CurrentUserSession = null;
            this.PostLoginActions = [];
            this.Initialize();
        }

        private EditedEntity:Models.Entity;
        private CurrentUserSession:Models.UserSession;
        private PostLoginActions:any[];

        public SetEditedEntity(entity:Models.Entity):void {
            this.EditedEntity = entity;
        }

        public GetEditedEntity(entityName:string, entityId:number):Models.Entity {
            if (!this.EditedEntity ||
                this.EditedEntity.EntitySystemName !== entityName ||
                this.EditedEntity.Id !== entityId) {
                this.EditedEntity = null;
            }
            return this.EditedEntity;
        }

        public SetCurrentUserSession(userSession:Models.UserSession):void {
            var previousSession:Models.UserSession = this.CurrentUserSession;
            var pluginSession:Models.UserSession = null;
            var pluginOperation:string = null;
            this.CurrentUserSession = userSession;
            this.UpdateSavedUserSession(userSession);
            if (!userSession) {
                //Invalidation
                pluginSession = previousSession;
                pluginOperation = Static.PluginOperation.Delete;
                this.MessagingService.Messages.User.LoggedOut.publish(previousSession);
            } else {
                //New login
                pluginSession = userSession;
                pluginOperation = Static.PluginOperation.Create;
                this.MessagingService.Messages.User.LoggedIn.publish(userSession);
                this.PostLoginHandler();
            }

            //Execute session associated plugins
            var pluginContextInitial:Models.PluginContext<Models.UserSession> = Models.PluginContext.CreateForSession(pluginSession, pluginOperation);
            this.PluginsExecutorService.ExecuteAllPluginsFor(pluginContextInitial, null);
        }

        public GetCurrentUserSession():Models.UserSession {
            return this.CurrentUserSession;
        }

        public UpdateCurrentUserSession(validTo:number, token:string):void {
            var currentSession:Models.UserSession = this.CurrentUserSession;
            if (currentSession && currentSession.ValidTo < validTo) {
                currentSession.ValidTo = validTo;
                currentSession.Token = token;
            }
            this.UpdateSavedUserSession(currentSession);

            //Execute session associated plugins
            var pluginContextInitial:Models.PluginContext<Models.UserSession> =
                Models.PluginContext.CreateForSession(currentSession, Static.PluginOperation.Update);
            this.PluginsExecutorService.ExecuteAllPluginsFor(pluginContextInitial, null);
        }

        public RegisterPostLoginAction(actionName:string, canCancel:boolean, action:() => void, cancel:() => void):void {
            var currentUserSession:Models.UserSession = this.CurrentUserSession;
            this.PostLoginActions.add({
                registeringUser: currentUserSession && currentUserSession.User.UserName,
                actionName: actionName,
                canCancel: canCancel,
                action: action,
                cancel: cancel
            });
        }

        private PostLoginHandler():void {
            var _this:StateService = this;
            var currentUserSession:Models.UserSession = this.CurrentUserSession;

            var userPostLoginActionPredicate:(i:any) => boolean = function (item:any):boolean {
                return !item.registeringUser ||
                    item.registeringUser === currentUserSession.User.UserName;
            };
            var cancelableActionPredicate:(i:any) => boolean = function (item:any):boolean {
                return item.canCancel;
            };

            var userPostLoginActions:any[] = this.PostLoginActions.where(userPostLoginActionPredicate);
            this.PostLoginActions = [];
            if (userPostLoginActions.length === 0) {
                return;
            }

            //Assemble confirmation message
            var cancelableActions:any[] = userPostLoginActions.where(cancelableActionPredicate);
            var shouldCreateConfirmationDialog:boolean = cancelableActions && cancelableActions.length > 0;

            //Execute actions
            if (!shouldCreateConfirmationDialog) {
                this.ExecutePostLoginActions(userPostLoginActions, false);
            } else {
                var clientReadableActionsList:string[] = this.CreateClientReadableActionsList(cancelableActions);
                this.DialogService.CreateConfirmationDialog(clientReadableActionsList, function (result:boolean):void {
                    _this.ExecutePostLoginActions(userPostLoginActions, result);

                    //Start with new screen
                    if (!result) {
                        _this.RedirectService.RedirectToHomeScreen();
                    }
                });
            }
        }

        private CreateClientReadableActionsList(cancelableActions:any[]):string[] {
            var result:string[] = [this.LocalizationService.Resources.RetryActionsQuestion];
            for (var i:number = 0; i < cancelableActions.length; i++) {
                var action:any = cancelableActions[i];
                result.push(this.LocalizationService.GetResourceByKey(action.actionName, null));
            }
            return result;
        }

        private ExecutePostLoginActions(postLoginActions:any[], executeCancelable:boolean):void {
            //Execute pending actions
            for (var i:number = 0; i < postLoginActions.length; i++) {
                var postLoginAction:any = postLoginActions[i];
                var actionFn:() => void = postLoginAction.action;
                var cancelFn:() => void = postLoginAction.cancel;
                var canCancel:boolean = postLoginAction.canCancel;
                if (!canCancel || executeCancelable) {
                    actionFn();
                } else {
                    cancelFn();
                }
            }
        }

        private Initialize():void {
            var savedSession:Models.UserSession = this.PersistentStorageService.LoadUserSession();
            if (savedSession !== null) {
                this.SetCurrentUserSession(savedSession);
            }
        }

        private UpdateSavedUserSession(userSession:Models.UserSession):void {
            var savedSession:Models.UserSession = this.PersistentStorageService.LoadUserSession();
            if (userSession !== null && userSession.StayLoggedIn) {
                this.PersistentStorageService.SaveUserSession(userSession);
            } else if (savedSession !== null) {
                this.PersistentStorageService.SaveUserSession(null);
            }
        }
    }
}
