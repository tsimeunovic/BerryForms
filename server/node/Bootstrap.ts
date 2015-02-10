'use strict';

export module NodeHelpers {
    export class Bootstrap {
        public static Setup() {
            //Prototype overrides
            RegExp.prototype['toJSON'] = function() { return this.source; };
        }
    }
}
