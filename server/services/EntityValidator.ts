/// <reference path="../GlobalReferences.ts" />
/// <reference path="../data/common/IMongoRepository.ts" />
/// <reference path="../services/IValidator.ts" />
/// <reference path="../model/ClientErrorsModel.ts" />

import Contract = require('../services/IValidator');
import ClientErrorModel = require('../model/ClientErrorModel');
import ClientErrorsModel = require('../model/ClientErrorsModel');
import RepositoryFactoryModule = require('../services/RepositoryFactory');
import RepositoryContract = require('../data/common/IMongoRepository');

export module Services {
    'use strict';

    export class EntityValidator<T> implements Contract.Services.IValidator<T> {
        public Validate(object:any, callback:(validationErrors:ClientErrorsModel.Model.ClientErrorsModel) => void):void {
            //Check for object data
            if (!object) {
                var emptyEntityErrorsModel:ClientErrorsModel.Model.ClientErrorsModel =
                    ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('EmptyEntityValidation', null);
                callback(emptyEntityErrorsModel);
                return;
            }

            //Check for defined entity type
            var entitySystemName:string = object.EntitySystemName;
            if (!entitySystemName) {
                var unknownTypeEntityErrorsModel:ClientErrorsModel.Model.ClientErrorsModel =
                    ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('UnknownTypeEntityValidation', null);
                callback(unknownTypeEntityErrorsModel);
                return;
            }

            //Check for some data
            if (!object.Data || !Object.keys(object.Data).length) {
                var noDataEntityErrorsModel:ClientErrorsModel.Model.ClientErrorsModel =
                    ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('NoDataEntityValidation', null);
                callback(noDataEntityErrorsModel);
                return;
            }

            //Verify presence of required fields
            var metadataRepositoryFactory:RepositoryFactoryModule.Services.RepositoryFactory = new RepositoryFactoryModule.Services.RepositoryFactory();
            var metadataRepository:RepositoryContract.Data.IMongoRepository<any> = metadataRepositoryFactory.CreateRepositoryFor('metadata', null);
            var requestContext:any = {source: 'system'};

            metadataRepository.FindByCondition({EntitySystemName: entitySystemName}, requestContext,
                function (data:any[], errors:ClientErrorsModel.Model.ClientErrorsModel):void {
                    if (errors) {
                        var invalidSystemNameErrorsModel:ClientErrorsModel.Model.ClientErrorsModel =
                            ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('CouldNotLoadSchemaEntityValidation', null);
                        callback(invalidSystemNameErrorsModel);
                    } else if (!data || !data.length) {
                        var unknownSchemaEntityErrorsModel:ClientErrorsModel.Model.ClientErrorsModel =
                            ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('UnknownSchemaEntityErrorsModel', [entitySystemName]);
                        callback(unknownSchemaEntityErrorsModel);
                    } else {
                        var metadata:any = data[0];
                        var errorsModel:ClientErrorsModel.Model.ClientErrorsModel = new ClientErrorsModel.Model.ClientErrorsModel();
                        for (var i:number = 0; i < metadata.Fields.length; i++) {
                            var fieldMetadata:any = metadata.Fields[i];
                            if (fieldMetadata.Required && !object.Data[fieldMetadata.FieldSystemName]) {
                                if (object.Data[fieldMetadata.FieldSystemName] === false) {
                                    //Valid falsy value
                                } else {
                                    errorsModel.Errors.push(
                                        new ClientErrorModel.Model.ClientErrorModel('RequiredFieldMissingEntityValidation', [fieldMetadata.FieldSystemName]));
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
