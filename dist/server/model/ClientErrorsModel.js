/// <reference path="../model/ErrorsModel.ts" />
/// <reference path="../model/ClientErrorModel.ts" />
'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Base = require('../model/ErrorsModel');
var ClientErrorModel = require('../model/ClientErrorModel');
var Model;
(function (Model) {
    var ClientErrorsModel = (function (_super) {
        __extends(ClientErrorsModel, _super);
        function ClientErrorsModel() {
            _super.call(this);
            this.Type = 'Client';
        }
        ClientErrorsModel.CreateWithError = function (key, parameters) {
            var result = new Model.ClientErrorsModel();
            var error = new ClientErrorModel.Model.ClientErrorModel(key, parameters);
            result.Errors = [error];
            return result;
        };
        return ClientErrorsModel;
    })(Base.Model.ErrorsModel);
    Model.ClientErrorsModel = ClientErrorsModel;
})(Model = exports.Model || (exports.Model = {}));
//# sourceMappingURL=ClientErrorsModel.js.map