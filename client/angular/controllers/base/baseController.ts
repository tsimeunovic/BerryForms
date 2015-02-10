'use strict';

//Base controllers for all views
module Controllers {
    export class BaseController {
        constructor(public Scope:any) {
            this.Subscriptions = [];
            this.SetupBaseController();
        }

        private Subscriptions:any[];

        private SetupBaseController() {
            this.Scope.$on('$destroy', this.RemoveAllSubscriptions.bind(this));
        }

        private RemoveAllSubscriptions() {
            var _this = this;
            for (var i = 0; i < _this.Subscriptions.length; i++) {
                var subscription = this.Subscriptions[i];
                subscription(); //Unsubscribe
            }
            this.Subscriptions = [];
        }

        public AddSubscription(subscription) {
            this.Subscriptions.push(subscription);
        }
    }
}
