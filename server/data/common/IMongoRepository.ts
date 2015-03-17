/// <reference path="../../model/ClientErrorsModel.ts" />

'use strict';

import ErrorsModel = require('../../model/ClientErrorsModel');

export module Data {
    export interface IMongoRepository<T> {
        //Read
        FindById(id:any, requestContext:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel)=>void): void;
        FindByCondition(condition:any, requestContext:any, callback:(data:T[], errors:ErrorsModel.Model.ClientErrorsModel)=>void): void;
        FindPaged(condition:any, page:number, size:number, requestContext:any, callback:(pagedData:any, errors:ErrorsModel.Model.ClientErrorsModel)=>void): void;
        FindByConditionAndProject(condition:any, projector:any, requestContext:any, callback:(data:T[], errors:ErrorsModel.Model.ClientErrorsModel)=>void):void;

        //Create
        Create(data:T, requestContext:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel)=> void): void;
        CreateMultiple(data:T[], requestContext:any, callback:(data:T[], errors:ErrorsModel.Model.ClientErrorsModel)=> void): void;

        //Update
        Update(data:T, requestContext:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel)=> void): void;

        //Delete
        Delete(id:any, requestContext:any, callback:(success:boolean, errors:ErrorsModel.Model.ClientErrorsModel)=> void): void;

        //Log
        LogOperationAsync(requestContext:any, collection:string, id:number, operation:string, additionalArgs:any, callback:(error:any)=>void):void;
        GetLatestLogRecordsFor(userName:string, entities:string[], count:number, callback:(data:any[], err:any)=>void):void;
        GetEntitiesSummary(entities:string[], minutes:number, callback:(data:any[], err:any)=>void):void;
    }
}