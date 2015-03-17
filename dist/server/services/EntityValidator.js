/// <reference path="../GlobalReferences.ts" />
/// <reference path="../data/common/IMongoRepository.ts" />
/// <reference path="../services/IValidator.ts" />
/// <reference path="../model/ClientErrorsModel.ts" />
'use strict';
var ClientErrorModel = require('../model/ClientErrorModel');
var ClientErrorsModel = require('../model/ClientErrorsModel');
var RepositoryFactoryModule = require('../services/RepositoryFactory');
var Services;
(function (Services) {
    var EntityValidator = (function () {
        function EntityValidator() {
        }
        EntityValidator.prototype.Validate = function (object, callback) {
            //Check for object data
            if (!object) {
                var emptyEntityErrorsModel = ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('EmptyEntityValidation', null);
                callback(emptyEntityErrorsModel);
                return;
            }
            //Check for defined entity type
            var entitySystemName = object.EntitySystemName;
            if (!entitySystemName) {
                var unknownTypeEntityErrorsModel = ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('UnknownTypeEntityValidation', null);
                callback(unknownTypeEntityErrorsModel);
                return;
            }
            //Check for some data
            if (!object.Data || !Object.keys(object.Data).length) {
                var noDataEntityErrorsModel = ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('NoDataEntityValidation', null);
                callback(noDataEntityErrorsModel);
                return;
            }
            //Verify presence of required fields
            var metadataRepositoryFactory = new RepositoryFactoryModule.Services.RepositoryFactory();
            var metadataRepository = metadataRepositoryFactory.CreateRepositoryFor('metadata', null);
            var requestContext = { source: 'system' };
            metadataRepository.FindByCondition({ EntitySystemName: entitySystemName }, requestContext, function (data, errors) {
                if (errors) {
                    var invalidSystemNameErrorsModel = ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('CouldNotLoadSchemaEntityValidation', null);
                    callback(invalidSystemNameErrorsModel);
                }
                else if (!data || !data.length) {
                    var unknownSchemaEntityErrorsModel = ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('UnknownSchemaEntityErrorsModel', [entitySystemName]);
                    callback(unknownSchemaEntityErrorsModel);
                }
                else {
                    var metadata = data[0];
                    var errorsModel = new ClientErrorsModel.Model.ClientErrorsModel();
                    for (var i = 0; i < metadata.Fields.length; i++) {
                        var fieldMetadata = metadata.Fields[i];
                        if (fieldMetadata.Required && !object.Data[fieldMetadata.FieldSystemName]) {
                            if (object.Data[fieldMetadata.FieldSystemName] === false) {
                            }
                            else {
                                errorsModel.Errors.push(new ClientErrorModel.Model.ClientErrorModel('RequiredFieldMissingEntityValidation', [fieldMetadata.FieldSystemName]));
                            }
                        }
                    }
                    //Everything is valid
                    callback(errorsModel);
                }
            });
        };
        return EntityValidator;
    })();
    Services.EntityValidator = EntityValidator;
})(Services = exports.Services || (exports.Services = {}));
//# sourceMappingURL=EntityValidator.js.map