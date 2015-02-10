'use strict';
var NodeHelpers;
(function (NodeHelpers) {
    var Bootstrap = (function () {
        function Bootstrap() {
        }
        Bootstrap.Setup = function () {
            //Prototype overrides
            RegExp.prototype['toJSON'] = function () {
                return this.source;
            };
        };
        return Bootstrap;
    })();
    NodeHelpers.Bootstrap = Bootstrap;
})(NodeHelpers = exports.NodeHelpers || (exports.NodeHelpers = {}));
//# sourceMappingURL=Bootstrap.js.map