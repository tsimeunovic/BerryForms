export module NodeHelpers {
    'use strict';

    export class Bootstrap {
        public static Setup():void {
            //Prototype overrides
            /* tslint:disable:no-string-literal */
            RegExp.prototype['toJSON'] = function():any { return this.source; };
        }
    }
}
