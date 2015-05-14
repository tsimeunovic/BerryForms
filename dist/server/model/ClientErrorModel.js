//Represents error propagated to the client
var Model;
(function (Model) {
    'use strict';
    var ClientErrorModel = (function () {
        function ClientErrorModel(key, parameters) {
            this.ErrorTypeKey = key;
            this.ErrorParameters = parameters;
        }
        return ClientErrorModel;
    })();
    Model.ClientErrorModel = ClientErrorModel;
})(Model = exports.Model || (exports.Model = {}));
//# sourceMappingURL=ClientErrorModel.js.map