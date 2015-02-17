'use strict';

import ErrorsModel = require('../model/ClientErrorsModel');

export module Services {
    export interface ISecurityService {
        LoginUser(request:any, callback:(data:any, errors:ErrorsModel.Model.ClientErrorsModel)=>void): void;
        ValidateRequest(request:any, callback:(valid:boolean, errors:ErrorsModel.Model.ClientErrorsModel)=>void);
    }
}