/// <reference path="../GlobalReferences.ts" />
/// <reference path="../data/IRepository.ts" />
/// <reference path="../services/IValidator.ts" />
/// <reference path="../model/ClientErrorsModel.ts" />

'use strict';

import Contract = require('../services/IValidator');
import ClientErrorModel = require('../model/ClientErrorModel');
import ClientErrorsModel = require('../model/ClientErrorsModel');
import RepositoryFactory = require('../services/RepositoryFactory');
import RepositoryContract = require('../data/IRepository');

export module Services {
    export class EntityValidator<T> implements Contract.Services.IValidator<T> {
        constructor() {
        }

        public Validate(object:any, callback:(validationErrors:ClientErrorsModel.Model.ClientErrorsModel)=>void):void {
            //Check for object data
            if (!object) {
                var emptyEntityErrorsModel:ClientErrorsModel.Model.ClientErrorsModel = ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('EmptyEntityValidation', null);
                callback(emptyEntityErrorsModel);
                return;
            }

            //Check for defined entity type
            var entitySystemName = object.EntitySystemName;
            if (!entitySystemName) {
                var unknownTypeEntityErrorsModel:ClientErrorsModel.Model.ClientErrorsModel = ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('UnknownTypeEntityValidation', null);
                callback(unknownTypeEntityErrorsModel);
                return;
            }

            //Check for some data
            if (!object.Data || !Object.keys(object.Data).length) {
                var noDataEntityErrorsModel:ClientErrorsModel.Model.ClientErrorsModel = ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('NoDataEntityValidation', null);
                callback(noDataEntityErrorsModel);
                return;
            }

            //Verify presence of required fields
            var metadataRepositoryFactory = new RepositoryFactory.Services.RepositoryFactory();
            var metadataRepository:RepositoryContract.Data.IRepository<any> = metadataRepositoryFactory.CreateRepositoryFor('metadata', null);
            metadataRepository.FindByCondition({EntitySystemName: entitySystemName}, function (data:any[], errors:ClientErrorsModel.Model.ClientErrorsModel) {
                if (errors) {
                    var invalidSystemNameErrorsModel:ClientErrorsModel.Model.ClientErrorsModel = ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('CouldNotLoadSchemaEntityValidation', null);
                    callback(invalidSystemNameErrorsModel);
                }
                else if (!data || !data.length) {
                    var unknownSchemaEntityErrorsModel:ClientErrorsModel.Model.ClientErrorsModel = ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('UnknownSchemaEntityErrorsModel', [entitySystemName]);
                    callback(unknownSchemaEntityErrorsModel);
                }
                else {
                    var metadata = data[0];
                    var errorsModel = new ClientErrorsModel.Model.ClientErrorsModel();
                    for (var i = 0; i < metadata.Fields.length; i++) {
                        var fieldMetadata = metadata.Fields[i];
                        if (fieldMetadata.Required && !object.Data[fieldMetadata.FieldSystemName]) {
                            if (object.Data[fieldMetadata.FieldSystemName] === false) {
                                //Valid falsy value
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
        }
    }
}
