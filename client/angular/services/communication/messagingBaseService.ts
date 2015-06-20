/// <reference path="../../../extensions/arrayExtensions.ts" />

//Base class for messaging service. Contains registry of registered listeners and methods for adding and notifying them
module Services {
    'use strict';

    export class MessagingBaseService {
        constructor(private RootScope:any) {
        }

        //Subscribers list
        private SubscriberList:any[][] = [];

        //General implementation for subscribers manipulation and messaging
        public GetSubscribers(messageName:string):any[] {
            var subscribersQueue:any[] = this.SubscriberList[messageName];
            if (typeof subscribersQueue === 'undefined') {
                subscribersQueue = [];
                this.SubscriberList[messageName] = subscribersQueue;
            }
            return subscribersQueue;
        }

        public AddSubscriber(messageName:string, callbackFunction:(message:any) => void):() => void {
            var subscribers:any = this.GetSubscribers(messageName);
            var elementIndex:number = subscribers.indexOf(callbackFunction);
            if (elementIndex === -1) {
                subscribers.push(callbackFunction);
            }

            //Return unsubscribe function
            var _this:MessagingBaseService = this;
            return function ():void {
                _this.RemoveSubscriber(messageName, callbackFunction);
            };
        }

        public AddOneTimeSubscriber(messageName:string, callbackFunction:(message:any) => void):() => void {
            var _this:MessagingBaseService = this;

            var wrapperFunction:(m:any) => void = function (message:any):void {
                callbackFunction(message);
                _this.RemoveSubscriber(messageName, wrapperFunction);
            };

            this.AddSubscriber(messageName, wrapperFunction);

            return function ():void {
                _this.RemoveSubscriber(messageName, wrapperFunction);
            };
        }

        public RemoveSubscriber(messageName:string, callbackFunction:(message:any) => void):void {
            var subscribers:any[] = this.GetSubscribers(messageName);

            if (typeof callbackFunction === 'undefined') {
                subscribers.splice(0);
            }

            var elementIndex:number = subscribers.indexOf(callbackFunction);
            if (elementIndex > -1) {
                subscribers.splice(elementIndex, 1);
            }
        }

        public NotifySubscribers(messageName:string, message:any, withRootApply:boolean = false):void {
            var subscribersCopy:any[] = this.GetSubscribers(messageName).createCopy();
            for (var i:number = 0; i < subscribersCopy.length; i++) {
                var subscriberCallback:(message:any) => void = subscribersCopy[i];
                this.InvokeSubscriberCallback(subscriberCallback, message, withRootApply);
            }
        }

        private InvokeSubscriberCallback(subscriberCallback:(message:any) => void, message:any, withRootApply:boolean):void {
            withRootApply ?
                this.RootScope.$apply(function ():void {
                    subscriberCallback(message);
                }) :
                subscriberCallback(message);
        }
    }
}
