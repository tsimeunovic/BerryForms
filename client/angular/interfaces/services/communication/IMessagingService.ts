/// <reference path="../../../../static/loadingType.ts" />
/// <reference path="../../../models/security/userSessionModel.ts" />
/// <reference path="../../../models/core/entityMetadataModel.ts" />
/// <reference path="../../../models/core/entityModel.ts" />
/// <reference path="../../../interfaces/services/interaction/INotificationService.ts" />

//Interface for Messaging service (used for communication between components)
module Services {
    'use strict';

    //Defined messaging methods
    export class IMessagingServiceType {
        public Form:any = {
          DisplayItem: {
              subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
              unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
              publish: function (itemData:Models.Entity, itemMetadata:Models.EntityMetadata):void { throw new Error(); }
          }
        };
        public EntityList:any = {
        };
        public Metadata:any = {
            Created: {
                subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                publish: function (entityMetadata:Models.EntityMetadata):void { throw new Error(); }
            },
            Modified: {
                subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                publish: function (entityMetadata:Models.EntityMetadata):void { throw new Error(); }
            },
            Deleted: {
                subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                publish: function (entityMetadata:Models.EntityMetadata):void { throw new Error(); }
            }
        };
        public Entity:any = {
            Created: {
                subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                publish: function (entity:Models.Entity):void { throw new Error(); }
            },
            Modify: {
                subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                publish: function (entity:Models.Entity):void { throw new Error(); }
            },
            Modified: {
                subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                publish: function (entity:Models.Entity):void { throw new Error(); }
            },
            Delete: {
                subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                publish: function (entity:Models.Entity):void { throw new Error(); }
            },
            Deleted: {
                subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                publish: function (entity:Models.Entity):void { throw new Error(); }
            }
        };
        public Notification:any = {
            Message: {
                subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                publish: function (message:string, severity:Static.NotificationSeverity):void { throw new Error(); }
            }
        };
        public Loading:any = {
            Started: {
                subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                publish: function (task:Static.LoadingType):void { throw new Error(); }
            },
            Finished: {
                subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                publish: function (task:Static.LoadingType):void { throw new Error(); }
            },
            Reset: {
                subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                publish: function ():void { throw new Error(); }
            }
        };
        public Cache:any = {
            MetadataList: {
                Loaded: {
                    subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                    unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                    publish: function (metadataList:Models.EntityMetadata[]):void { throw new Error(); }
                },
                Invalidated: {
                    subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                    unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                    publish: function ():void { throw new Error(); }
                }
            },
            EntityList: {
                DataLoaded: {
                    subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                    unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                    publish: function (loadedData:any):void { throw new Error(); }
                },
                Changed: {
                    subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                    unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                    publish: function (entitySystemName:string):void { throw new Error(); }
                },
                Invalidated: {
                    subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                    unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                    publish: function (entitySystemName:string):void { throw new Error(); }
                }
            }
        };
        public Dialog:any = {
            Create: {
                subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                publish: function (dialogData:any):void { throw new Error(); }
            },
            Remove: {
                subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                publish: function ():void { throw new Error(); }
            }
        };
        public User:any = {
            LoggedOut: {
                subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                publish: function (loggedOutUser:Models.UserSession):void { throw new Error(); }
            },
            LoggedIn: {
                subscribe: function (subscriber:(m:any) => void):() => void { throw new Error(); },
                unsubscribe: function (subscriber:(m:any) => void):void { throw new Error(); },
                publish: function (user:Models.UserSession):void { throw new Error(); }
            }
        };
    }

    //Messaging service contract
    export interface IMessagingService {
        Messages: IMessagingServiceType;
    }
}
