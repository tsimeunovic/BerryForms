import ErrorsModel = require('../../model/ClientErrorsModel');

export module Data {
    'use strict';

    export interface IDashboardRepository {
        GetLastActivity(request:any, callback:(data:any[], errors:ErrorsModel.Model.ClientErrorsModel) => void): void;
        GetMyLastActivity(request:any, callback:(data:any[], errors:ErrorsModel.Model.ClientErrorsModel) => void):void;
        GetEntitiesActivitySummary(request:any, callback:(data:any[], errors:ErrorsModel.Model.ClientErrorsModel) => void):void;
    }
}
