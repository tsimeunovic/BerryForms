/// <reference path="../GlobalReferences.ts" />
/// <reference path="../data/common/IMongoRepository.ts" />
/// <reference path="../services/IValidator.ts" />
/// <reference path="../model/ClientErrorsModel.ts" />
var ClientErrorsModel = require('../model/ClientErrorsModel');
var RepositoryFactoryModule = require('../services/RepositoryFactory');
var Services;
(function (Services) {
    'use strict';
    var EntityMetadataValidator = (function () {
        function EntityMetadataValidator() {
        }
        EntityMetadataValidator.prototype.Validate = function (object, callback) {
            //Check for object data
            if (!object) {
                var emptyMetadataErrorsModel = ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('EmptyMetadataValidation', null);
                callback(emptyMetadataErrorsModel);
                return;
            }
            if (!object.Fields || !object.Fields.length) {
            }
            if (!object.IconClassName) {
                var noIconErrorsModel = ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('NoIconMetadataValidation', null);
                callback(noIconErrorsModel);
                return;
            }
            //Check for system name validity
            var entitySystemNameRegExp = new RegExp('^[a-zA-Z\\u00C0-\\u017F0-9_]{1,}$', 'i');
            if (!object.EntityName || !object.EntitySystemName || !entitySystemNameRegExp.test(object.EntitySystemName)) {
                var invalidSystemNameErrorsModel = ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('InvalidSystemNameMetadataValidation', null);
                callback(invalidSystemNameErrorsModel);
            }
            else {
                //Need to verify system name uniqueness
                var metadataRepositoryFactory = new RepositoryFactoryModule.Services.RepositoryFactory();
                if (object.Id) {
                    //Update
                    callback(null);
                    return;
                }
                //Create
                var metadataRepository = metadataRepositoryFactory.CreateRepositoryFor('metadata', null);
                var requestContext = { source: 'system' };
                metadataRepository.FindByCondition({ EntitySystemName: object.EntitySystemName }, requestContext, function (data, errors) {
                    if (errors) {
                        var invalidSystemNameErrorsModel = ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('CouldNotVerifySystemNameMetadataValidation', null);
                        callback(invalidSystemNameErrorsModel);
                    }
                    else if (data && data.length) {
                        var existingSystemNameErrorsModel = ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('ExistingSystemNameMetadataValidation', [object.EntitySystemName]);
                        callback(existingSystemNameErrorsModel);
                    }
                    else {
                        //Everything is valid
                        callback(null);
                    }
                });
            }
        };
        return EntityMetadataValidator;
    })();
    Services.EntityMetadataValidator = EntityMetadataValidator;
})(Services = exports.Services || (exports.Services = {}));
//# sourceMappingURL=EntityMetadataValidator.js.map