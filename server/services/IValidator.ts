/// <reference path="../data/IRepository.ts" />
/// <reference path="../model/ClientErrorsModel.ts" />

'use strict';

import ClientErrorsModel = require('../model/ClientErrorsModel');

export module Services {
    export interface IValidator<T> {
        Validate(object:T, callback:(validationErrors:ClientErrorsModel.Model.ClientErrorsModel)=>void): void;
    }
}
