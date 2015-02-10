/// <reference path="../GlobalReferences.ts" />
/// <reference path="../services/IValidatorFactory.ts" />

'use strict';

import Contract = require('../services/IValidatorFactory');
import ChildContract = require('../services/IValidator');
import ConfigServer = require('../config/Config');
import EntityValidator = require('../services/EntityValidator');
import EntityMetadataValidator = require('../services/EntityMetadataValidator');
import UnknownTypeValidator = require('../services/UnknownTypeValidator');

export module Services {
    export class ValidatorFactory<T> implements Contract.Services.IValidatorFactory<T> {
        public CreateValidatorFor(type:string, name:string):ChildContract.Services.IValidator<T> {
            if(type == 'metadata') return new EntityMetadataValidator.Services.EntityMetadataValidator<T>();
            else if(type == 'entity') return new EntityValidator.Services.EntityValidator<T>();
            else return new UnknownTypeValidator.Services.UnknownTypeValidator<T>(type);
        }
    }
}
