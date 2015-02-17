/// <reference path="../../../extensions/arrayExtensions.ts" />

'use strict';

//Base class for messaging service. Contains registry of registered listeners and methods for adding and notifying them
module Services {
    export class MessagingBaseService {
        constructor(private RootScope:any) {
        }

        //Subscribers list
        private _subscriberList:any[] = [];

        //General implementation for subscribers manipulation and messaging
        public getSubscribers(messageName):any[] {
            var subscribersQueue = this._subscriberList[messageName];
            if (typeof subscribersQueue == 'undefined') {
                subscribersQueue = [];
                this._subscriberList[messageName] = subscribersQueue;
            }
            return subscribersQueue;
        }

        public addSubscriber(messageName:string, callbackFunction:(message:any)=>void):()=>void {
            var subscribers = this.getSubscribers(messageName);
            var elementIndex = subscribers.indexOf(callbackFunction);
            if (elementIndex == -1) subscribers.push(callbackFunction);

            //Return unsubscribe function
            var _this = this;
            return function ():void {
                _this.removeSubscriber(messageName, callbackFunction);
            };
        }

        public addOneTimeSubscriber(messageName:string, callbackFunction:(message:any)=>void):()=>void {
            var _this = this;

            var wrapperFunction = function (message) {
                callbackFunction(message);
                _this.removeSubscriber(messageName, wrapperFunction);
            };

            this.addSubscriber(messageName, wrapperFunction);

            return function () {
                _this.removeSubscriber(messageName, wrapperFunction);
            };
        }

        public removeSubscriber(messageName:string, callbackFunction:(message:any)=>void):void {
            var subscribers = this.getSubscribers(messageName);

            if (typeof callbackFunction == 'undefined') {
                subscribers.splice(0);
            }

            var elementIndex = subscribers.indexOf(callbackFunction);
            if (elementIndex > -1) subscribers.splice(elementIndex, 1);
        }

        public notifySubscribers(messageName:string, message:any, withRootApply = false):void {
            var subscribersCopy:any[] = this.getSubscribers(messageName).createCopy();
            for (var i = 0; i < subscribersCopy.length; i++) {
                var subscriberCallback:(message:any)=>void = subscribersCopy[i];
                this.invokeSubscriberCallback(subscriberCallback, message, withRootApply)
            }
        }

        private invokeSubscriberCallback(subscriberCallback:(message:any)=>void, message:any, withRootApply:boolean):void {
            withRootApply ?
                this.RootScope.$apply(function () {
                    subscriberCallback(message)
                }) :
                subscriberCallback(message);
        }
    }
}
