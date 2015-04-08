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
            this.CreateMessageDefinitions();
            this.Setup();
        }

        //Public interface
        public Messages:Services.IMessagingServiceType;

        private MessageDefinitions:any[];

        //Set messaging implementation
        private Setup():void {
            //Implement all messages
            this.ImplementAllMessageDefinitions();

            //Register as global object - for plugin listeners
            _global.Instances = _global.Instances || {};
            _global.Instances.MessagingService = this;
        }

        private CreateMessageDefinitions():void {
            this.Messages = new Services.IMessagingServiceType();
            this.MessageDefinitions = [
                //'Message name', Message reference, Requires apply, Arguments transform fn
                ['formDisplayItem', this.Messages.Form.DisplayItem, false, function (itemData, itemMetadata) {
                    return {Data: itemData, Metadata: itemMetadata}
                }],
                ['notificationMessage', this.Messages.Notification.Message, false, function (message, severity) {
                    return {Message: message, Severity: severity}
                }],

                ['metadataCreated', this.Messages.Metadata.Created, false, null],
                ['metadataModified', this.Messages.Metadata.Modified, false, null],
                ['metadataDeleted', this.Messages.Metadata.Deleted, false, null],

                ['entityCreated', this.Messages.Entity.Created, false, null],
                ['entityModify', this.Messages.Entity.Modify, false, null],
                ['entityModified', this.Messages.Entity.Modified, false, null],
                ['entityDelete', this.Messages.Entity.Delete, false, null],
                ['entityDeleted', this.Messages.Entity.Deleted, false, null],

                ['loadingStarted', this.Messages.Loading.Started, false, null],
                ['loadingFinished', this.Messages.Loading.Finished, false, null],
                ['loadingReset', this.Messages.Loading.Reset, false, null],

                ['cacheMetadataListLoaded', this.Messages.Cache.MetadataList.Loaded, false, null],
                ['cacheMetadataListInvalidated', this.Messages.Cache.MetadataList.Invalidated, false, null],

                ['cacheEntityListDataLoaded', this.Messages.Cache.EntityList.DataLoaded, false, null],
                ['cacheEntityListDataChanged', this.Messages.Cache.EntityList.Changed, false, null],
                ['cacheEntityListDataInvalidated', this.Messages.Cache.EntityList.Invalidated, false, null],

                ['dialogCreate', this.Messages.Dialog.Create, false, null],
                ['dialogRemove', this.Messages.Dialog.Remove, false, null],

                ['userLoggedIn', this.Messages.User.LoggedIn, false, null],
                ['userLoggedOut', this.Messages.User.LoggedOut, false, null]
            ];
        }

        private ImplementAllMessageDefinitions():void {
            for (var i = 0; i < this.MessageDefinitions.length; i++) {
                var message = this.MessageDefinitions[i];
                this.ImplementMessage(message);
            }
        }

        private ImplementMessage(messageImplementation:any):void {
            var _this = this;
            var messageName = messageImplementation[0];
            var messageReference = messageImplementation[1];
            var requiresRootApply = messageImplementation[2];
            var transformFn = messageImplementation[3];

            //Create implementations
            messageReference.subscribe = function (subscriber) {
                return _this.addSubscriber(messageName, subscriber);
            };
            messageReference.unsubscribe = function (subscriber) {
                return _this.removeSubscriber(messageName, subscriber);
            };
            messageReference.publish = function (a1, a2, a3, a4, a5) {
                var model = transformFn ?
                    transformFn(a1, a2, a3, a4, a5) :
                    (a1 || null);
                return _this.notifySubscribers(messageName, model, requiresRootApply);
            };
        }
    }
}
