var NodeHelpers;
(function (NodeHelpers) {
    'use strict';
    var Bootstrap = (function () {
        function Bootstrap() {
        }
        Bootstrap.Setup = function () {
            //Prototype overrides
            /* tslint:disable:no-string-literal */
            RegExp.prototype['toJSON'] = function () { return this.source; };
        };
        return Bootstrap;
    })();
    NodeHelpers.Bootstrap = Bootstrap;
})(NodeHelpers = exports.NodeHelpers || (exports.NodeHelpers = {}));
//# sourceMappingURL=Bootstrap.js.map