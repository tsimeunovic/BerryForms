/// <reference path="./messagingBaseService.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />

'use strict';
var _global:any = this;

//Service used for communication between components. Has multiple messages that listeners can subscribe to and publishers can publish
module Services {
    export class MessagingService extends MessagingBaseService implements Services.IMessagingService {
        public static injection():any[] {
            return [
                '$rootScope',
                MessagingService
            ];
        }

        constructor(RootScope:any) {
            super(RootScope);
            this.Setup();
        }

        //Public interface
        public Messages:Services.IMessagingServiceType;

        //Set messaging implementation
        private Setup():void {
            this.Messages = new Services.IMessagingServiceType();

            //Set all messages
            this.SetupFormDisplayItem();
            this.SetupMetadataCreated();
            this.SetupMetadataModified();
            this.SetupMetadataDeleted();
            this.SetupEntityCreated();
            this.SetupEntityModify();
            this.SetupEntityModified();
            this.SetupEntityDelete();
            this.SetupEntityDeleted();
            this.SetupNotificationMessages();
            this.SetupLoadingStarted();
            this.SetupLoadingFinished();
            this.SetupLoadingReset();
            this.SetupCacheMetadataListLoaded();
            this.SetupCacheMetadataListInvalidated();
            this.SetupCacheEntityListDataLoaded();
            this.SetupCacheEntityListChanged();
            this.SetupCacheEntityListInvalidated();
            this.SetupDialogCreate();
            this.SetupDialogRemove();
            this.SetupUserLoggedOut();
            this.SetupUserLoggedIn();

            //Register as global object - for plugin listeners
            _global.Instances = _global.Instances || {};
            _global.Instances.MessagingService = this;
        }

        private SetupFormDisplayItem():void {
            var _this = this;
            var formDisplayItemEventName = 'formDisplayItem';
            var requiresRootApply = false;

            this.Messages.Form.DisplayItem.subscribe = function (subscriber) {
                return _this.addSubscriber(formDisplayItemEventName, subscriber);
            };
            this.Messages.Form.DisplayItem.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(formDisplayItemEventName, subscriber);
            };
            this.Messages.Form.DisplayItem.publish = function (itemData, itemMetadata) {
                return _this.notifySubscribers(formDisplayItemEventName, {
                    Data: itemData,
                    Metadata: itemMetadata
                }, requiresRootApply);
            };
        }

        private SetupMetadataCreated():void {
            var _this = this;
            var metadataCreatedEventName = 'metadataCreated';
            var requiresRootApply = false;

            this.Messages.Metadata.Created.subscribe = function (subscriber) {
                return _this.addSubscriber(metadataCreatedEventName, subscriber);
            };
            this.Messages.Metadata.Created.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(metadataCreatedEventName, subscriber);
            };
            this.Messages.Metadata.Created.publish = function (entityMetadata) {
                return _this.notifySubscribers(metadataCreatedEventName, entityMetadata, requiresRootApply);
            };
        }

        private SetupMetadataModified():void {
            var _this = this;
            var metadataModifiedEventName = 'metadataModified';
            var requiresRootApply = false;

            this.Messages.Metadata.Modified.subscribe = function (subscriber) {
                return _this.addSubscriber(metadataModifiedEventName, subscriber);
            };
            this.Messages.Metadata.Modified.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(metadataModifiedEventName, subscriber);
            };
            this.Messages.Metadata.Modified.publish = function (entityMetadata) {
                return _this.notifySubscribers(metadataModifiedEventName, entityMetadata, requiresRootApply);
            };
        }

        private SetupMetadataDeleted():void {
            var _this = this;
            var metadataDeletedEventName = 'metadataDeleted';
            var requiresRootApply = false;

            this.Messages.Metadata.Deleted.subscribe = function (subscriber) {
                return _this.addSubscriber(metadataDeletedEventName, subscriber);
            };
            this.Messages.Metadata.Deleted.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(metadataDeletedEventName, subscriber);
            };
            this.Messages.Metadata.Deleted.publish = function (entityMetadata) {
                return _this.notifySubscribers(metadataDeletedEventName, entityMetadata, requiresRootApply);
            };
        }

        private SetupEntityCreated():void {
            var _this = this;
            var entityCreatedEventName = 'entityCreated';
            var requiresRootApply = false;

            this.Messages.Entity.Created.subscribe = function (subscriber) {
                return _this.addSubscriber(entityCreatedEventName, subscriber);
            };
            this.Messages.Entity.Created.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(entityCreatedEventName, subscriber);
            };
            this.Messages.Entity.Created.publish = function (entity) {
                return _this.notifySubscribers(entityCreatedEventName, entity, requiresRootApply);
            };
        }

        private SetupEntityModify():void {
            var _this = this;
            var entityModifyEventName = 'entityModify';
            var requiresRootApply = false;

            this.Messages.Entity.Modify.subscribe = function (subscriber) {
                return _this.addSubscriber(entityModifyEventName, subscriber);
            };
            this.Messages.Entity.Modify.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(entityModifyEventName, subscriber);
            };
            this.Messages.Entity.Modify.publish = function (entity) {
                return _this.notifySubscribers(entityModifyEventName, entity, requiresRootApply);
            };
        }

        private SetupEntityModified():void {
            var _this = this;
            var entityModifiedEventName = 'entityModified';
            var requiresRootApply = false;

            this.Messages.Entity.Modified.subscribe = function (subscriber) {
                return _this.addSubscriber(entityModifiedEventName, subscriber);
            };
            this.Messages.Entity.Modified.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(entityModifiedEventName, subscriber);
            };
            this.Messages.Entity.Modified.publish = function (entity) {
                return _this.notifySubscribers(entityModifiedEventName, entity, requiresRootApply);
            };
        }

        private SetupEntityDelete():void {
            var _this = this;
            var entityDeleteEventName = 'entityDelete';
            var requiresRootApply = false;

            this.Messages.Entity.Delete.subscribe = function (subscriber) {
                return _this.addSubscriber(entityDeleteEventName, subscriber);
            };
            this.Messages.Entity.Delete.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(entityDeleteEventName, subscriber);
            };
            this.Messages.Entity.Delete.publish = function (entity) {
                return _this.notifySubscribers(entityDeleteEventName, entity, requiresRootApply);
            };
        }

        private SetupEntityDeleted():void {
            var _this = this;
            var entityDeletedEventName = 'entityDeleted';
            var requiresRootApply = false;

            this.Messages.Entity.Deleted.subscribe = function (subscriber) {
                return _this.addSubscriber(entityDeletedEventName, subscriber);
            };
            this.Messages.Entity.Deleted.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(entityDeletedEventName, subscriber);
            };
            this.Messages.Entity.Deleted.publish = function (entity) {
                return _this.notifySubscribers(entityDeletedEventName, entity, requiresRootApply);
            };
        }

        private SetupNotificationMessages():void {
            var _this = this;
            var notificationMessageEventName = 'notificationMessage';
            var requiresRootApply = false;

            this.Messages.Notification.Message.subscribe = function (subscriber) {
                return _this.addSubscriber(notificationMessageEventName, subscriber);
            };
            this.Messages.Notification.Message.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(notificationMessageEventName, subscriber);
            };
            this.Messages.Notification.Message.publish = function (message, severity) {
                return _this.notifySubscribers(notificationMessageEventName,
                    {
                        Message: message,
                        Severity: severity
                    }, requiresRootApply);
            };
        }

        private SetupLoadingStarted() {
            var _this = this;
            var loadingStartedEventName = 'loadingStarted';
            var requiresRootApply = false;

            this.Messages.Loading.Started.subscribe = function (subscriber) {
                return _this.addSubscriber(loadingStartedEventName, subscriber);
            };
            this.Messages.Loading.Started.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(loadingStartedEventName, subscriber);
            };
            this.Messages.Loading.Started.publish = function (task) {
                return _this.notifySubscribers(loadingStartedEventName, task, requiresRootApply);
            };
        }

        private SetupLoadingFinished() {
            var _this = this;
            var loadingFinishedEventName = 'loadingFinished';
            var requiresRootApply = false;

            this.Messages.Loading.Finished.subscribe = function (subscriber) {
                return _this.addSubscriber(loadingFinishedEventName, subscriber);
            };
            this.Messages.Loading.Finished.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(loadingFinishedEventName, subscriber);
            };
            this.Messages.Loading.Finished.publish = function (task) {
                return _this.notifySubscribers(loadingFinishedEventName, task, requiresRootApply);
            };
        }

        private SetupLoadingReset() {
            var _this = this;
            var loadingResetEventName = 'loadingReset';
            var requiresRootApply = false;

            this.Messages.Loading.Reset.subscribe = function (subscriber) {
                return _this.addSubscriber(loadingResetEventName, subscriber);
            };
            this.Messages.Loading.Reset.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(loadingResetEventName, subscriber);
            };
            this.Messages.Loading.Reset.publish = function () {
                return _this.notifySubscribers(loadingResetEventName, null, requiresRootApply);
            };
        }

        private SetupCacheMetadataListLoaded() {
            var _this = this;
            var cacheMetadataListLoadedEventName = 'cacheMetadataListLoaded';
            var requiresRootApply = false;

            this.Messages.Cache.MetadataList.Loaded.subscribe = function (subscriber) {
                return _this.addSubscriber(cacheMetadataListLoadedEventName, subscriber);
            };
            this.Messages.Cache.MetadataList.Loaded.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(cacheMetadataListLoadedEventName, subscriber);
            };
            this.Messages.Cache.MetadataList.Loaded.publish = function (metadataList) {
                return _this.notifySubscribers(cacheMetadataListLoadedEventName, metadataList, requiresRootApply);
            };
        }

        private SetupCacheMetadataListInvalidated() {
            var _this = this;
            var cacheMetadataListInvalidatedEventName = 'cacheMetadataListInvalidated';
            var requiresRootApply = false;

            this.Messages.Cache.MetadataList.Invalidated.subscribe = function (subscriber) {
                return _this.addSubscriber(cacheMetadataListInvalidatedEventName, subscriber);
            };
            this.Messages.Cache.MetadataList.Invalidated.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(cacheMetadataListInvalidatedEventName, subscriber);
            };
            this.Messages.Cache.MetadataList.Invalidated.publish = function () {
                return _this.notifySubscribers(cacheMetadataListInvalidatedEventName, null, requiresRootApply);
            };
        }

        private SetupCacheEntityListDataLoaded() {
            var _this = this;
            var cacheEntityListDataLoadedEventName = 'cacheEntityListDataLoaded';
            var requiresRootApply = false;

            this.Messages.Cache.EntityList.DataLoaded.subscribe = function (subscriber) {
                return _this.addSubscriber(cacheEntityListDataLoadedEventName, subscriber);
            };
            this.Messages.Cache.EntityList.DataLoaded.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(cacheEntityListDataLoadedEventName, subscriber);
            };
            this.Messages.Cache.EntityList.DataLoaded.publish = function (loadedData) {
                return _this.notifySubscribers(cacheEntityListDataLoadedEventName, loadedData, requiresRootApply);
            };
        }

        private SetupCacheEntityListChanged() {
            var _this = this;
            var cacheEntityListChangedEventName = 'cacheEntityListChanged';
            var requiresRootApply = false;

            this.Messages.Cache.EntityList.Changed.subscribe = function (subscriber) {
                return _this.addSubscriber(cacheEntityListChangedEventName, subscriber);
            };
            this.Messages.Cache.EntityList.Changed.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(cacheEntityListChangedEventName, subscriber);
            };
            this.Messages.Cache.EntityList.Changed.publish = function (entitySystemName) {
                return _this.notifySubscribers(cacheEntityListChangedEventName, entitySystemName, requiresRootApply);
            };
        }

        private SetupCacheEntityListInvalidated() {
            var _this = this;
            var cacheEntityListInvalidatedEventName = 'cacheEntityListInvalidated';
            var requiresRootApply = false;

            this.Messages.Cache.EntityList.Invalidated.subscribe = function (subscriber) {
                return _this.addSubscriber(cacheEntityListInvalidatedEventName, subscriber);
            };
            this.Messages.Cache.EntityList.Invalidated.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(cacheEntityListInvalidatedEventName, subscriber);
            };
            this.Messages.Cache.EntityList.Invalidated.publish = function (entitySystemName) {
                return _this.notifySubscribers(cacheEntityListInvalidatedEventName, entitySystemName, requiresRootApply);
            };
        }

        private SetupDialogCreate() {
            var _this = this;
            var dialogCreateEventName = 'dialogCreate';
            var requiresRootApply = false;

            this.Messages.Dialog.Create.subscribe = function (subscriber) {
                return _this.addSubscriber(dialogCreateEventName, subscriber);
            };
            this.Messages.Dialog.Create.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(dialogCreateEventName, subscriber);
            };
            this.Messages.Dialog.Create.publish = function (dialogData) {
                return _this.notifySubscribers(dialogCreateEventName, dialogData, requiresRootApply);
            };
        }

        private SetupDialogRemove() {
            var _this = this;
            var dialogRemoveEventName = 'dialogRemove';
            var requiresRootApply = false;

            this.Messages.Dialog.Remove.subscribe = function (subscriber) {
                return _this.addSubscriber(dialogRemoveEventName, subscriber);
            };
            this.Messages.Dialog.Remove.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(dialogRemoveEventName, subscriber);
            };
            this.Messages.Dialog.Remove.publish = function () {
                return _this.notifySubscribers(dialogRemoveEventName, null, requiresRootApply);
            };
        }

        private SetupUserLoggedOut() {
            var _this = this;
            var userLoggedOutEventName = 'userLoggedOut';
            var requiresRootApply = false;

            this.Messages.User.LoggedOut.subscribe = function (subscriber) {
                return _this.addSubscriber(userLoggedOutEventName, subscriber);
            };
            this.Messages.User.LoggedOut.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(userLoggedOutEventName, subscriber);
            };
            this.Messages.User.LoggedOut.publish = function () {
                return _this.notifySubscribers(userLoggedOutEventName, null, requiresRootApply);
            };
        }

        private SetupUserLoggedIn() {
            var _this = this;
            var userLoggedInEventName = 'userLoggedIn';
            var requiresRootApply = false;

            this.Messages.User.LoggedIn.subscribe = function (subscriber) {
                return _this.addSubscriber(userLoggedInEventName, subscriber);
            };
            this.Messages.User.LoggedIn.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(userLoggedInEventName, subscriber);
            };
            this.Messages.User.LoggedIn.publish = function (user) {
                return _this.notifySubscribers(userLoggedInEventName, user, requiresRootApply);
            };
        }
    }
}
