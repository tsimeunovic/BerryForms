/// <reference path="../GlobalReferences.ts" />
/// <reference path="../services/IValidatorFactory.ts" />
'use strict';
var EntityValidator = require('../services/EntityValidator');
var EntityMetadataValidator = require('../services/EntityMetadataValidator');
var UnknownTypeValidator = require('../services/UnknownTypeValidator');
var Services;
(function (Services) {
    var ValidatorFactory = (function () {
        function ValidatorFactory() {
        }
        ValidatorFactory.prototype.CreateValidatorFor = function (type, name) {
            if (type == 'metadata')
                return new EntityMetadataValidator.Services.EntityMetadataValidator();
            else if (type == 'entity')
                return new EntityValidator.Services.EntityValidator();
            else
                return new UnknownTypeValidator.Services.UnknownTypeValidator(type);
        };
        return ValidatorFactory;
    })();
    Services.ValidatorFactory = ValidatorFactory;
})(Services = exports.Services || (exports.Services = {}));
//# sourceMappingURL=ValidatorFactory.js.map