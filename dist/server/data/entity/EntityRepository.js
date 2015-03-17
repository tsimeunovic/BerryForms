/// <reference path="../../GlobalReferences.ts" />
/// <reference path="../common/IMongoRepository.ts" />
/// <reference path="./IEntityRepository.ts" />
/// <reference path="../../services/IRepositoryFactory.ts" />
/// <reference path="../../services/IValidatorFactory.ts" />
'use strict';
var RepositoryFactory = require('../../services/RepositoryFactory');
var ValidatorFactory = require('../../services/ValidatorFactory');
var ProjectorFactory = require('../../services/ProjectorFactory');
var Data;
(function (Data) {
    var EntityRepository = (function () {
        function EntityRepository() {
        }
        EntityRepository.prototype.CreateRepositoryForRequest = function (request) {
            var type = request.params.type;
            var name = request.params.name;
            var factory = new RepositoryFactory.Services.RepositoryFactory();
            return factory.CreateRepositoryFor(type, name);
        };
        EntityRepository.prototype.CreateValidatorForRequest = function (request) {
            var type = request.params.type;
            var name = request.params.name;
            var factory = new ValidatorFactory.Services.ValidatorFactory();
            return factory.CreateValidatorFor(type, name);
        };
        EntityRepository.prototype.CreateProjectorForRequest = function (request) {
            var type = request.params.type;
            var factory = new ProjectorFactory.Services.ProjectorFactory();
            return factory.CreateProjectorFor(type);
        };
        EntityRepository.prototype.CreateRequestContext = function (request) {
            return {
                source: 'client',
                session: request.session,
                user: request.session ? request.session.User.UserName : null
            };
        };
        //Special methods
        EntityRepository.prototype.GetAllProjected = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var projector = this.CreateProjectorForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            repository.FindByConditionAndProject({}, projector, requestContext, callback);
        };
        //Generic methods
        //Read
        EntityRepository.prototype.GetAll = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            repository.FindByCondition({}, requestContext, callback);
        };
        EntityRepository.prototype.GetPaged = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            var page = request.params.page * 1;
            var size = request.params.size * 1;
            repository.FindPaged({}, page, size, requestContext, callback);
        };
        EntityRepository.prototype.GetFiltered = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            var page = request.params.page * 1;
            var size = request.params.size * 1;
            var query = request.body;
            repository.FindPaged(query, page, size, requestContext, callback);
        };
        EntityRepository.prototype.GetById = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            var id = request.params.id;
            repository.FindById(id, requestContext, callback);
        };
        //Create
        EntityRepository.prototype.Create = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var validator = this.CreateValidatorForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            var data = request.body;
            validator.Validate(data, function (validationErrors) {
                if (validationErrors && validationErrors.HasErrors())
                    callback(null, validationErrors);
                else
                    repository.Create(data, requestContext, callback);
            });
        };
        EntityRepository.prototype.Update = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var validator = this.CreateValidatorForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            var data = request.body;
            validator.Validate(data, function (validationErrors) {
                if (validationErrors && validationErrors.HasErrors())
                    callback(null, validationErrors);
                else
                    repository.Update(data, requestContext, callback);
            });
        };
        //Delete
        EntityRepository.prototype.Delete = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            var id = request.params.id;
            repository.Delete(id, requestContext, callback);
        };
        return EntityRepository;
    })();
    Data.EntityRepository = EntityRepository;
})(Data = exports.Data || (exports.Data = {}));
//# sourceMappingURL=EntityRepository.js.map