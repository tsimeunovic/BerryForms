/// <reference path="../data/common/IMongoRepository.ts" />
/// <reference path="../services/IValidator.ts" />

import ChildContract = require('../services/IValidator');

export module Services {
    'use strict';

    export interface IValidatorFactory<T> {
        CreateValidatorFor(type:string, name:string): ChildContract.Services.IValidator<T>;
    }
}
