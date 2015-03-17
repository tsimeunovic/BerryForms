/// <reference path="../GlobalReferences.ts" />
/// <reference path="../data/common/IMongoRepository.ts" />
/// <reference path="../services/IValidator.ts" />
/// <reference path="../model/ClientErrorsModel.ts" />
'use strict';
var ClientErrorsModel = require('../model/ClientErrorsModel');
var Services;
(function (Services) {
    var UnknownTypeValidator = (function () {
        function UnknownTypeValidator(typeName) {
            this.TypeName = typeName;
        }
        UnknownTypeValidator.prototype.Validate = function (object, callback) {
            var unknownTypeErrorsModel = ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('UnknownTypeValidation', [this.TypeName]);
            callback(unknownTypeErrorsModel);
        };
        return UnknownTypeValidator;
    })();
    Services.UnknownTypeValidator = UnknownTypeValidator;
})(Services = exports.Services || (exports.Services = {}));
//# sourceMappingURL=UnknownTypeValidator.js.map