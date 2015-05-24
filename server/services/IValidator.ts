/// <reference path="../data/common/IMongoRepository.ts" />
/// <reference path="../model/ClientErrorsModel.ts" />

import ClientErrorsModel = require('../model/ClientErrorsModel');

export module Services {
    'use strict';

    export interface IValidator<T> {
        Validate(object:T, callback:(validationErrors:ClientErrorsModel.Model.ClientErrorsModel) => void): void;
    }
}
