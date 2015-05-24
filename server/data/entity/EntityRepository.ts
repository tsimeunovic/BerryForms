/// <reference path="../../GlobalReferences.ts" />
/// <reference path="../common/IMongoRepository.ts" />
/// <reference path="./IEntityRepository.ts" />
/// <reference path="../../services/IRepositoryFactory.ts" />
/// <reference path="../../services/IValidatorFactory.ts" />

import Contract = require('IEntityRepository');
import DbContract = require('../common/IMongoRepository');
import ErrorsModel = require('../../model/ClientErrorsModel');
import ValidatorContract = require('../../services/IValidator');
import RepositoryFactory = require('../../services/RepositoryFactory');
import ValidatorFactory = require('../../services/ValidatorFactory');
import ProjectorFactory = require('../../services/ProjectorFactory');

export module Data {
    'use strict';

    export class EntityRepository<T> implements Contract.Data.IEntityRepository<T> {
        //Special methods
        public GetAllProjected(request:any, callback:(data:T[], errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            var repository:DbContract.Data.IMongoRepository<any> = this.CreateRepositoryForRequest(request);
            var projector:any = this.CreateProjectorForRequest(request);
            var requestContext:any = this.CreateRequestContext(request);
            repository.FindByConditionAndProject({}, projector, requestContext, callback);
        }

        //Generic methods
        //Read
        public GetAll(request:any, callback:(data:T[], errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            var repository:DbContract.Data.IMongoRepository<any> = this.CreateRepositoryForRequest(request);
            var requestContext:any = this.CreateRequestContext(request);
            repository.FindByCondition({}, requestContext, callback);
        }

        public GetPaged(request:any, callback:(pagedData:any, errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            var repository:DbContract.Data.IMongoRepository<any> = this.CreateRepositoryForRequest(request);
            var requestContext:any = this.CreateRequestContext(request);
            var page:number = request.params.page * 1;
            var size:number = request.params.size * 1;
            repository.FindPaged({}, page, size, requestContext, callback);
        }

        public GetFiltered(request:any, callback:(filteredData:any, errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            var repository:DbContract.Data.IMongoRepository<any> = this.CreateRepositoryForRequest(request);
            var requestContext:any = this.CreateRequestContext(request);
            var page:number = request.params.page * 1;
            var size:number = request.params.size * 1;
            var query:any = request.body;

            repository.FindPaged(query, page, size, requestContext, callback);
        }

        public GetById(request:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            var repository:DbContract.Data.IMongoRepository<any> = this.CreateRepositoryForRequest(request);
            var requestContext:any = this.CreateRequestContext(request);
            var id:string = request.params.id;
            repository.FindById(id, requestContext, callback);
        }

        //Create
        public Create(request:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            var repository:DbContract.Data.IMongoRepository<any> = this.CreateRepositoryForRequest(request);
            var validator:ValidatorContract.Services.IValidator<any> = this.CreateValidatorForRequest(request);
            var requestContext:any = this.CreateRequestContext(request);
            var data:any = request.body;

            validator.Validate(data, function (validationErrors:ErrorsModel.Model.ClientErrorsModel):void {
                if (validationErrors && validationErrors.HasErrors()) {
                    callback(null, validationErrors);
                } else {
                    repository.Create(data, requestContext, callback);
                }
            });
        }

        public Update(request:any, callback:(data:T, errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            var repository:DbContract.Data.IMongoRepository<any> = this.CreateRepositoryForRequest(request);
            var validator:ValidatorContract.Services.IValidator<any> = this.CreateValidatorForRequest(request);
            var requestContext:any = this.CreateRequestContext(request);
            var data:any = request.body;

            validator.Validate(data, function (validationErrors:ErrorsModel.Model.ClientErrorsModel):void {
                if (validationErrors && validationErrors.HasErrors()) {
                    callback(null, validationErrors);
                } else {
                    repository.Update(data, requestContext, callback);
                }
            });
        }

        //Delete
        public Delete(request:any, callback:(success:boolean, errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            var repository:DbContract.Data.IMongoRepository<any> = this.CreateRepositoryForRequest(request);
            var requestContext:any = this.CreateRequestContext(request);
            var id:string = request.params.id;
            repository.Delete(id, requestContext, callback);
        }

        //Helper methods
        private CreateRepositoryForRequest(request:any):DbContract.Data.IMongoRepository<any> {
            var type:string = request.params.type;
            var name:string = request.params.name;
            var factory:RepositoryFactory.Services.RepositoryFactory = new RepositoryFactory.Services.RepositoryFactory();
            return factory.CreateRepositoryFor(type, name);
        }

        private CreateValidatorForRequest(request:any):ValidatorContract.Services.IValidator<any> {
            var type:string = request.params.type;
            var name:string = request.params.name;
            var factory:ValidatorFactory.Services.ValidatorFactory<any> = new ValidatorFactory.Services.ValidatorFactory();
            return factory.CreateValidatorFor(type, name);
        }

        private CreateProjectorForRequest(request:any):any {
            var type:string = request.params.type;
            var factory:ProjectorFactory.Services.ProjectorFactory = new ProjectorFactory.Services.ProjectorFactory();
            return factory.CreateProjectorFor(type);
        }

        private CreateRequestContext(request:any):any {
            return {
                source: 'client',
                session: request.session,
                user: request.session ? request.session.User.UserName : null
            };
        }
    }
}
