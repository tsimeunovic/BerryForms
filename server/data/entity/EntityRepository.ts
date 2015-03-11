/// <reference path="../../GlobalReferences.ts" />
/// <reference path="../common/IMongoRepository.ts" />
/// <reference path="./IEntityRepository.ts" />
/// <reference path="../../services/IRepositoryFactory.ts" />
/// <reference path="../../services/IValidatorFactory.ts" />

'use strict';
import Contract = require('IEntityRepository');
import ChildContract = require('../common/IMongoRepository');
import ErrorsModel = require('../../model/ClientErrorsModel');
import ValidatorContract = require('../../services/IValidator');
import RepositoryFactoryContract = require('../../services/IRepositoryFactory');
import ValidatorFactoryContract = require('../../services/IValidatorFactory');
import RepositoryFactory = require('../../services/RepositoryFactory');
import ValidatorFactory = require('../../services/ValidatorFactory');
import ProjectorFactory = require('../../services/ProjectorFactory');

export module Data {
    export class EntityRepository<T> implements Contract.Data.IEntityRepository<T> {
        private CreateRepositoryForRequest(request:any):ChildContract.Data.IMongoRepository<any> {
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

        private CreateRequestContext(request:any):any {
            return {
                source: 'client',
                session: request.session,
                user: request.session ? request.session.User.UserName : null
            }
        }

        //Special methods
        public GetAllProjected(request:any, callback:(data:T[], errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var repository = this.CreateRepositoryForRequest(request);
            var projector = this.CreateProjectorForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            repository.FindByConditionAndProject({}, projector, requestContext, callback);
        }

        //Generic methods
        //Read
        public GetAll(request:any, callback:(data:T[], errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var repository = this.CreateRepositoryForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            repository.FindByCondition({}, requestContext, callback);
        }

        public GetPaged(request:any, callback:(pagedData:any, errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var repository = this.CreateRepositoryForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            var page = request.params.page * 1;
            var size = request.params.size * 1;
            repository.FindPaged({}, page, size, requestContext, callback);
        }

        public GetFiltered(request:any, callback:(filteredData:any, errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var repository = this.CreateRepositoryForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            var page = request.params.page * 1;
            var size = request.params.size * 1;
            var query = request.body;

            repository.FindPaged(query, page, size, requestContext, callback);
        }

        public GetById(request:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var repository = this.CreateRepositoryForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            var id = request.params.id;
            repository.FindById(id, requestContext, callback);
        }

        //Create
        public Create(request:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var repository = this.CreateRepositoryForRequest(request);
            var validator = this.CreateValidatorForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            var data = request.body;

            validator.Validate(data, function (validationErrors:ErrorsModel.Model.ClientErrorsModel) {
                if (validationErrors && validationErrors.HasErrors()) callback(null, validationErrors);
                else repository.Create(data, requestContext, callback);
            });
        }

        public Update(request:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var repository = this.CreateRepositoryForRequest(request);
            var validator = this.CreateValidatorForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            var data = request.body;

            validator.Validate(data, function (validationErrors:ErrorsModel.Model.ClientErrorsModel) {
                if (validationErrors && validationErrors.HasErrors()) callback(null, validationErrors);
                else repository.Update(data, requestContext, callback);
            });
        }

        //Delete
        public Delete(request:any, callback:(success:boolean, errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var repository = this.CreateRepositoryForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            var id = request.params.id;
            repository.Delete(id, requestContext, callback);
        }
    }
}
