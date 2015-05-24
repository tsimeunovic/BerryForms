/// <reference path="../GlobalReferences.ts" />
/// <reference path="../services/IValidatorFactory.ts" />

import Contract = require('../services/IValidatorFactory');
import ChildContract = require('../services/IValidator');
import EntityValidatorModule = require('../services/EntityValidator');
import EntityMetadataValidatorModule = require('../services/EntityMetadataValidator');
import UnknownTypeValidatorModule = require('../services/UnknownTypeValidator');

export module Services {
    'use strict';

    export class ValidatorFactory<T> implements Contract.Services.IValidatorFactory<T> {
        public CreateValidatorFor(type:string, name:string):ChildContract.Services.IValidator<T> {
            if (type === 'metadata') {
                return new EntityMetadataValidatorModule.Services.EntityMetadataValidator<T>();
            } else if (type === 'entity') {
                return new EntityValidatorModule.Services.EntityValidator<T>();
            } else {
                return new UnknownTypeValidatorModule.Services.UnknownTypeValidator<T>(type);
            }
        }
    }
}
