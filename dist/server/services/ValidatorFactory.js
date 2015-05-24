/// <reference path="../GlobalReferences.ts" />
/// <reference path="../services/IValidatorFactory.ts" />
var EntityValidatorModule = require('../services/EntityValidator');
var EntityMetadataValidatorModule = require('../services/EntityMetadataValidator');
var UnknownTypeValidatorModule = require('../services/UnknownTypeValidator');
var Services;
(function (Services) {
    'use strict';
    var ValidatorFactory = (function () {
        function ValidatorFactory() {
        }
        ValidatorFactory.prototype.CreateValidatorFor = function (type, name) {
            if (type === 'metadata') {
                return new EntityMetadataValidatorModule.Services.EntityMetadataValidator();
            }
            else if (type === 'entity') {
                return new EntityValidatorModule.Services.EntityValidator();
            }
            else {
                return new UnknownTypeValidatorModule.Services.UnknownTypeValidator(type);
            }
        };
        return ValidatorFactory;
    })();
    Services.ValidatorFactory = ValidatorFactory;
})(Services = exports.Services || (exports.Services = {}));
//# sourceMappingURL=ValidatorFactory.js.map