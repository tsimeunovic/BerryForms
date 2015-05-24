/// <reference path="../../model/ClientErrorsModel.ts" />

import ErrorsModel = require('../../model/ClientErrorsModel');

export module Data {
    'use strict';

    export interface IIdentifierRepository {
        GetNewIdentifierFor(newItemFromCollection:string, data:any, callback:(identifier:any, errors:ErrorsModel.Model.ClientErrorsModel) => void): void;
    }
}
