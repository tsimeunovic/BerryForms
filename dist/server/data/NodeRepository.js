/// <reference path="../GlobalReferences.ts" />
/// <reference path="./IRepository.ts" />
/// <reference path="./INodeRepository.ts" />
/// <reference path="../services/IRepositoryFactory.ts" />
/// <reference path="../services/IValidatorFactory.ts" />
'use strict';
var RepositoryFactory = require('../services/RepositoryFactory');
var ValidatorFactory = require('../services/ValidatorFactory');
var ProjectorFactory = require('../services/ProjectorFactory');
var Data;
(function (Data) {
    var NodeRepository = (function () {
        function NodeRepository() {
        }
        NodeRepository.prototype.CreateRepositoryForRequest = function (request) {
            var type = request.params.type;
            var name = request.params.name;
            var factory = new RepositoryFactory.Services.RepositoryFactory();
            return factory.CreateRepositoryFor(type, name);
        };
        NodeRepository.prototype.CreateValidatorForRequest = function (request) {
            var type = request.params.type;
            var name = request.params.name;
            var factory = new ValidatorFactory.Services.ValidatorFactory();
            return factory.CreateValidatorFor(type, name);
        };
        NodeRepository.prototype.CreateProjectorForRequest = function (request) {
            var type = request.params.type;
            var factory = new ProjectorFactory.Services.ProjectorFactory();
            return factory.CreateProjectorFor(type);
        };
        NodeRepository.prototype.CreateRequestContext = function (request) {
            return {
                source: 'client',
                session: request.session,
                user: request.session ? request.session.User.UserName : null
            };
        };
        //Special methods
        NodeRepository.prototype.GetAllProjected = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var projector = this.CreateProjectorForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            repository.FindByConditionAndProject({}, projector, requestContext, callback);
        };
        //Generic methods
        //Read
        NodeRepository.prototype.GetAll = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            repository.FindByCondition({}, requestContext, callback);
        };
        NodeRepository.prototype.GetPaged = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            var page = request.params.page * 1;
            var size = request.params.size * 1;
            repository.FindPaged({}, page, size, requestContext, callback);
        };
        NodeRepository.prototype.GetFiltered = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            var page = request.params.page * 1;
            var size = request.params.size * 1;
            var query = request.body;
            repository.FindPaged(query, page, size, requestContext, callback);
        };
        NodeRepository.prototype.GetById = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            var id = request.params.id;
            repository.FindById(id, requestContext, callback);
        };
        //Create
        NodeRepository.prototype.Create = function (request, callback) {
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
        NodeRepository.prototype.Update = function (request, callback) {
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
        NodeRepository.prototype.Delete = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var requestContext = this.CreateRequestContext(request);
            var id = request.params.id;
            repository.Delete(id, requestContext, callback);
        };
        return NodeRepository;
    })();
    Data.NodeRepository = NodeRepository;
})(Data = exports.Data || (exports.Data = {}));
//# sourceMappingURL=NodeRepository.js.map