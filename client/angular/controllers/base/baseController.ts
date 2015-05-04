//Base controllers for all views
module Controllers {
    'use strict';

    export class BaseController {
        constructor(public Scope:any) {
            this.Subscriptions = [];
            this.SetupBaseController();
        }

        private Subscriptions:any[];

        public AddSubscription(subscription:() => void):void {
            this.Subscriptions.push(subscription);
        }

        private SetupBaseController():void {
            this.Scope.$on('$destroy', this.RemoveAllSubscriptions.bind(this));
        }

        private RemoveAllSubscriptions():void {
            var _this:BaseController = this;
            for (var i:number = 0; i < _this.Subscriptions.length; i++) {
                var subscription:() => void = this.Subscriptions[i];
                subscription(); //Unsubscribe
            }
            this.Subscriptions = [];
        }
    }
}
