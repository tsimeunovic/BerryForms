/// <reference path="../model/ErrorsModel.ts" />
/// <reference path="../model/ClientErrorModel.ts" />

'use strict';

import Base = require('../model/ErrorsModel');
import ClientErrorModel = require('../model/ClientErrorModel');

export module Model {
    export class ClientErrorsModel extends Base.Model.ErrorsModel<ClientErrorModel.Model.ClientErrorModel> {
        constructor() {
            super();
            this.Type = 'Client';
        }

        public static CreateWithError(key:string, parameters:string[]):Model.ClientErrorsModel {
            var result:Model.ClientErrorsModel = new Model.ClientErrorsModel();
            var error = new ClientErrorModel.Model.ClientErrorModel(key, parameters);
            result.Errors = [error];
            return result;
        }
    }
}