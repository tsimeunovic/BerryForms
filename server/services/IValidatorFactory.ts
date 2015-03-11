/// <reference path="../data/common/IMongoRepository.ts" />
/// <reference path="../services/IValidator.ts" />

'use strict';

import ChildContract = require('../services/IValidator');

export module Services {
    export interface IValidatorFactory<T> {
        CreateValidatorFor(type:string, name:string): ChildContract.Services.IValidator<T>;
    }
}