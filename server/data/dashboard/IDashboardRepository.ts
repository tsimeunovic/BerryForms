'use strict';

import ErrorsModel = require('../../model/ClientErrorsModel');

export module Data {
    export interface IDashboardRepository {
        GetRecentActivity(request:any, callback:(data:any[], errors:ErrorsModel.Model.ClientErrorsModel)=>void): void;
        GetMyRecentActivity(request:any, callback:(data:any[], errors:ErrorsModel.Model.ClientErrorsModel)=>void):void;
        GetEntitiesActivitySummary(request:any, callback:(data:any[], errors:ErrorsModel.Model.ClientErrorsModel)=>void):void;
    }
}