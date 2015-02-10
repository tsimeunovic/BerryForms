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
        //Special methods
        NodeRepository.prototype.GetAllProjected = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var projector = this.CreateProjectorForRequest(request);
            repository.FindByConditionAndProject({}, projector, callback);
        };
        //Generic methods
        //Read
        NodeRepository.prototype.GetAll = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            repository.FindByCondition({}, callback);
        };
        NodeRepository.prototype.GetPaged = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var page = request.params.page * 1;
            var size = request.params.size * 1;
            repository.FindPaged({}, page, size, callback);
        };
        NodeRepository.prototype.GetFiltered = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var page = request.params.page * 1;
            var size = request.params.size * 1;
            var query = request.body;
            repository.FindPaged(query, page, size, callback);
        };
        NodeRepository.prototype.GetById = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var id = request.params.id;
            repository.FindById(id, callback);
        };
        //Create
        NodeRepository.prototype.Create = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var validator = this.CreateValidatorForRequest(request);
            var data = request.body;
            validator.Validate(data, function (validationErrors) {
                if (validationErrors && validationErrors.HasErrors())
                    callback(null, validationErrors);
                else
                    repository.Create(data, callback);
            });
        };
        NodeRepository.prototype.Update = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var validator = this.CreateValidatorForRequest(request);
            var data = request.body;
            validator.Validate(data, function (validationErrors) {
                if (validationErrors && validationErrors.HasErrors())
                    callback(null, validationErrors);
                else
                    repository.Update(data, callback);
            });
        };
        //Delete
        NodeRepository.prototype.Delete = function (request, callback) {
            var repository = this.CreateRepositoryForRequest(request);
            var id = request.params.id;
            repository.Delete(id, callback);
        };
        return NodeRepository;
    })();
    Data.NodeRepository = NodeRepository;
})(Data = exports.Data || (exports.Data = {}));
//# sourceMappingURL=NodeRepository.js.map