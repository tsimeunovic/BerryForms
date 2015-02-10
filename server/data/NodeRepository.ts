/// <reference path="../GlobalReferences.ts" />
/// <reference path="./IRepository.ts" />
/// <reference path="./INodeRepository.ts" />
/// <reference path="../services/IRepositoryFactory.ts" />
/// <reference path="../services/IValidatorFactory.ts" />

'use strict';
import Contract = require('../data/INodeRepository');
import ChildContract = require('../data/IRepository');
import ErrorsModel = require('../model/ClientErrorsModel');
import ValidatorContract = require('../services/IValidator');
import RepositoryFactoryContract = require('../services/IRepositoryFactory');
import ValidatorFactoryContract = require('../services/IValidatorFactory');
import RepositoryFactory = require('../services/RepositoryFactory');
import ValidatorFactory = require('../services/ValidatorFactory');
import ProjectorFactory = require('../services/ProjectorFactory');

export module Data {
    export class NodeRepository<T> implements Contract.Data.INodeRepository<T> {
        private CreateRepositoryForRequest(request:any):ChildContract.Data.IRepository<any> {
            var type = request.params.type;
            var name = request.params.name;
            var factory = new RepositoryFactory.Services.RepositoryFactory();
            return factory.CreateRepositoryFor(type, name);
        }

        private CreateValidatorForRequest(request:any):ValidatorContract.Services.IValidator<any> {
            var type = request.params.type;
            var name = request.params.name;
            var factory = new ValidatorFactory.Services.ValidatorFactory();
            return factory.CreateValidatorFor(type, name);
        }

        private CreateProjectorForRequest(request:any):any {
            var type = request.params.type;
            var factory = new ProjectorFactory.Services.ProjectorFactory();
            return factory.CreateProjectorFor(type);
        }

        //Special methods
        public GetAllProjected(request:any, callback:(data:T[], errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var repository = this.CreateRepositoryForRequest(request);
            var projector = this.CreateProjectorForRequest(request);
            repository.FindByConditionAndProject({}, projector, callback);
        }

        //Generic methods
        //Read
        public GetAll(request:any, callback:(data:T[], errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var repository = this.CreateRepositoryForRequest(request);
            repository.FindByCondition({}, callback);
        }

        public GetPaged(request:any, callback:(pagedData:any, errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var repository = this.CreateRepositoryForRequest(request);
            var page = request.params.page * 1;
            var size = request.params.size * 1;
            repository.FindPaged({}, page, size, callback);
        }

        public GetFiltered(request:any, callback:(filteredData:any, errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var repository = this.CreateRepositoryForRequest(request);
            var page = request.params.page * 1;
            var size = request.params.size * 1;
            var query = request.body;

            repository.FindPaged(query, page, size, callback);
        }

        public GetById(request:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var repository = this.CreateRepositoryForRequest(request);
            var id = request.params.id;
            repository.FindById(id, callback);
        }

        //Create
        public Create(request:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var repository = this.CreateRepositoryForRequest(request);
            var validator = this.CreateValidatorForRequest(request);
            var data = request.body;

            validator.Validate(data, function (validationErrors:ErrorsModel.Model.ClientErrorsModel) {
                if (validationErrors && validationErrors.HasErrors()) callback(null, validationErrors);
                else repository.Create(data, callback);
            });
        }

        public Update(request:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var repository = this.CreateRepositoryForRequest(request);
            var validator = this.CreateValidatorForRequest(request);
            var data = request.body;

            validator.Validate(data, function (validationErrors:ErrorsModel.Model.ClientErrorsModel) {
                if (validationErrors && validationErrors.HasErrors()) callback(null, validationErrors);
                else repository.Update(data, callback);
            });
        }

        //Delete
        public Delete(request:any, callback:(success:boolean, errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var repository = this.CreateRepositoryForRequest(request);
            var id = request.params.id;
            repository.Delete(id, callback);
        }
    }
}
