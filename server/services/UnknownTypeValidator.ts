/// <reference path="../GlobalReferences.ts" />
/// <reference path="../data/common/IMongoRepository.ts" />
/// <reference path="../services/IValidator.ts" />
/// <reference path="../model/ClientErrorsModel.ts" />

import Contract = require('../services/IValidator');
import ClientErrorsModel = require('../model/ClientErrorsModel');

export module Services {
    'use strict';

    export class UnknownTypeValidator<T> implements Contract.Services.IValidator<T> {
        constructor(typeName:string) {
            this.TypeName = typeName;
        }

        private TypeName:string;

        public Validate(object:T, callback:(validationErrors:ClientErrorsModel.Model.ClientErrorsModel) => void):void {
            var unknownTypeErrorsModel:ClientErrorsModel.Model.ClientErrorsModel =
                ClientErrorsModel.Model.ClientErrorsModel.CreateWithError('UnknownTypeValidation', [this.TypeName]);
            callback(unknownTypeErrorsModel);
        }
    }
}
