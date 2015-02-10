/// <reference path="../model/ClientErrorsModel.ts" />

'use strict';

import ErrorsModel = require('../model/ClientErrorsModel');

export module Data {
    export interface IIdentifierRepository {
        GetNewIdentifierFor(newItemFromCollection:string, data:any, callback:(identifier:any, errors:ErrorsModel.Model.ClientErrorsModel)=> void): void;
    }
}