/// <reference path="../../../../static/loadingType.ts" />

'use strict';

//Interface for Messaging service (used for communication between components)
module Services {
    //Defined messaging methods
    export class IMessagingServiceType {
        public Form = {
          DisplayItem: {
              subscribe: function (subscriber):()=>void { throw new Error(); },
              unsubscribe: function (subscriber):void { throw new Error(); },
              publish: function (itemData, itemMetadata):void { throw new Error(); }
          }
        };
        public EntityList = {
        };
        public Metadata = {
            Created: {
                subscribe: function (subscriber):()=>void { throw new Error(); },
                unsubscribe: function (subscriber):void { throw new Error(); },
                publish: function (entityMetadata):void { throw new Error(); }
            },
            Modified: {
                subscribe: function (subscriber):()=>void { throw new Error(); },
                unsubscribe: function (subscriber):void { throw new Error(); },
                publish: function (entityMetadata):void { throw new Error(); }
            },
            Deleted: {
                subscribe: function (subscriber):()=>void { throw new Error(); },
                unsubscribe: function (subscriber):void { throw new Error(); },
                publish: function (entityMetadata):void { throw new Error(); }
            }
        };
        public Entity = {
            Created: {
                subscribe: function (subscriber):()=>void { throw new Error(); },
                unsubscribe: function (subscriber):void { throw new Error(); },
                publish: function (entity):void { throw new Error(); }
            },
            Modify: {
                subscribe: function (subscriber):()=>void { throw new Error(); },
                unsubscribe: function (subscriber):void { throw new Error(); },
                publish: function (entity):void { throw new Error(); }
            },
            Modified: {
                subscribe: function (subscriber):()=>void { throw new Error(); },
                unsubscribe: function (subscriber):void { throw new Error(); },
                publish: function (entity):void { throw new Error(); }
            },
            Delete: {
                subscribe: function (subscriber):()=>void { throw new Error(); },
                unsubscribe: function (subscriber):void { throw new Error(); },
                publish: function (entity):void { throw new Error(); }
            },
            Deleted: {
                subscribe: function (subscriber):()=>void { throw new Error(); },
                unsubscribe: function (subscriber):void { throw new Error(); },
                publish: function (entity):void { throw new Error(); }
            }
        };
        public Notification = {
            Message: {
                subscribe: function (subscriber):()=>void { throw new Error(); },
                unsubscribe: function (subscriber):void { throw new Error(); },
                publish: function (message, severity):void { throw new Error(); }
            }
        };
        public Loading = {
            Started: {
                subscribe: function (subscriber):()=>void { throw new Error(); },
                unsubscribe: function (subscriber):void { throw new Error(); },
                publish: function (task:Static.LoadingType):void { throw new Error(); }
            },
            Finished: {
                subscribe: function (subscriber):()=>void { throw new Error(); },
                unsubscribe: function (subscriber):void { throw new Error(); },
                publish: function (task:Static.LoadingType):void { throw new Error(); }
            },
            Reset: {
                subscribe: function (subscriber):()=>void { throw new Error(); },
                unsubscribe: function (subscriber):void { throw new Error(); },
                publish: function ():void { throw new Error(); }
            }
        };
        public Cache = {
            MetadataList: {
                Loaded: {
                    subscribe: function (subscriber):()=>void { throw new Error(); },
                    unsubscribe: function (subscriber):void { throw new Error(); },
                    publish: function (metadataList):void { throw new Error(); }
                },
                Invalidated: {
                    subscribe: function (subscriber):()=>void { throw new Error(); },
                    unsubscribe: function (subscriber):void { throw new Error(); },
                    publish: function ():void { throw new Error(); }
                }
            },
            EntityList: {
                DataLoaded: {
                    subscribe: function (subscriber):()=>void { throw new Error(); },
                    unsubscribe: function (subscriber):void { throw new Error(); },
                    publish: function (loadedData):void { throw new Error(); }
                },
                Changed: {
                    subscribe: function (subscriber):()=>void { throw new Error(); },
                    unsubscribe: function (subscriber):void { throw new Error(); },
                    publish: function (entitySystemName):void { throw new Error(); }
                },
                Invalidated: {
                    subscribe: function (subscriber):()=>void { throw new Error(); },
                    unsubscribe: function (subscriber):void { throw new Error(); },
                    publish: function (entitySystemName):void { throw new Error(); }
                }
            }
        };
        public Dialog = {
            Create: {
                subscribe: function (subscriber):()=>void { throw new Error(); },
                unsubscribe: function (subscriber):void { throw new Error(); },
                publish: function (dialogData):void { throw new Error(); }
            },
            Remove: {
                subscribe: function (subscriber):()=>void { throw new Error(); },
                unsubscribe: function (subscriber):void { throw new Error(); },
                publish: function ():void { throw new Error(); }
            }
        };
        public User = {
            LoggedOut: {
                subscribe: function (subscriber):()=>void { throw new Error(); },
                unsubscribe: function (subscriber):void { throw new Error(); },
                publish: function ():void { throw new Error(); }
            },
            LoggedIn: {
                subscribe: function (subscriber):()=>void { throw new Error(); },
                unsubscribe: function (subscriber):void { throw new Error(); },
                publish: function (user):void { throw new Error(); }
            }
        }
    }

    //Messaging service contract
    export interface IMessagingService {
        Messages: IMessagingServiceType;
    }
}
