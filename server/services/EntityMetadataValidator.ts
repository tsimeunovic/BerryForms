/// <reference path="../GlobalReferences.ts" />
/// <reference path="../data/common/IMongoRepository.ts" />
/// <reference path="../services/IValidator.ts" />
/// <reference path="../model/ClientErrorsModel.ts" />

import Contract = require('../services/IValidator');
import ClientErrorsModel = require('../model/ClientErrorsModel');
import RepositoryFactoryModule = require('../services/RepositoryFactory');
import RepositoryContract = require('../data/common/IMongoRepository');

export module Services {
    'use strict';

    export class EntityMetadataValidator<T> implements Contract.Services.IValidator<T> {
        public Validate(object:any, callback:(validationErrors:ClientErrorsModel.Model.ClientErrorsModel) => void):void {
            //Check for object data
            if (!object) {
                var emptyMetadataErrorsModel:ClientErrorsModel.Model.ClientErrorsModel =
                    ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('EmptyMetadataValidation', null);
                callback(emptyMetadataErrorsModel);
                return;
            }

            if (!object.Fields || !object.Fields.length) {
                //No fields yet (is valid Metadata)
            }

            if (!object.IconClassName) {
                var noIconErrorsModel:ClientErrorsModel.Model.ClientErrorsModel =
                    ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('NoIconMetadataValidation', null);
                callback(noIconErrorsModel);
                return;
            }

            //Check for system name validity
            var entitySystemNameRegExp:RegExp = new RegExp('^[a-zA-Z\\u00C0-\\u017F0-9_]{1,}$', 'i');
            if (!object.EntityName || !object.EntitySystemName || !entitySystemNameRegExp.test(object.EntitySystemName)) {
                var invalidSystemNameErrorsModel:ClientErrorsModel.Model.ClientErrorsModel =
                    ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('InvalidSystemNameMetadataValidation', null);
                callback(invalidSystemNameErrorsModel);
            } else {
                //Need to verify system name uniqueness
                var metadataRepositoryFactory:RepositoryFactoryModule.Services.RepositoryFactory = new RepositoryFactoryModule.Services.RepositoryFactory();
                if (object.Id) {
                    //Update
                    callback(null);
                    return;
                }

                //Create
                var metadataRepository:RepositoryContract.Data.IMongoRepository<any> = metadataRepositoryFactory.CreateRepositoryFor('metadata', null);
                var requestContext:any = {source: 'system'};
                metadataRepository.FindByCondition({EntitySystemName: object.EntitySystemName}, requestContext,
                    function (data:any[], errors:ClientErrorsModel.Model.ClientErrorsModel):void {
                        if (errors) {
                            var invalidSystemNameErrorsModel:ClientErrorsModel.Model.ClientErrorsModel =
                                ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('CouldNotVerifySystemNameMetadataValidation', null);
                            callback(invalidSystemNameErrorsModel);
                        } else if (data && data.length) {
                            var existingSystemNameErrorsModel:ClientErrorsModel.Model.ClientErrorsModel =
                                ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('ExistingSystemNameMetadataValidation', [object.EntitySystemName]);
                            callback(existingSystemNameErrorsModel);
                        } else {
                            //Everything is valid
                            callback(null);
                        }
                    });
            }
        }
    }
}
