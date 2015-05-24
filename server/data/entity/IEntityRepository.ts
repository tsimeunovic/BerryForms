import ErrorsModel = require('../../model/ClientErrorsModel');

export module Data {
    'use strict';

    export interface IEntityRepository<T> {
        //Read
        GetAll(request:any, callback:(data:T[], errors:ErrorsModel.Model.ClientErrorsModel) => void):void;
        GetAllProjected(request:any, callback:(data:T[], errors:ErrorsModel.Model.ClientErrorsModel) => void):void;
        GetFiltered(request:any, callback:(filteredData:any, errors:ErrorsModel.Model.ClientErrorsModel) => void):void;
        GetPaged(request:any, callback:(pagedData:any, errors:ErrorsModel.Model.ClientErrorsModel) => void):void;
        GetById(request:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel) => void):void;

        //Create
        Create(request:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel) => void):void;
        Update(request:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel) => void):void;

        //Delete
        Delete(request:any, callback:(success:boolean, errors:ErrorsModel.Model.ClientErrorsModel) => void):void;
    }
}
