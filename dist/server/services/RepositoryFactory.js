/// <reference path="../GlobalReferences.ts" />
/// <reference path="./IRepositoryFactory.ts" />
var MongoRepository = require('../data/common/MongoRepository');
var ConfigServer = require('../config/Config').Config.Server;
var Services;
(function (Services) {
    'use strict';
    var RepositoryFactory = (function () {
        function RepositoryFactory() {
        }
        RepositoryFactory.prototype.CreateRepositoryFor = function (type, name) {
            var collectionName = this.GetCollectionNameFor(type, name);
            return new MongoRepository.Data.MongoRepository(collectionName);
        };
        RepositoryFactory.prototype.GetCollectionNameFor = function (type, name) {
            //TODO: Return null and create no repository for unknown type
            return type === 'entity' ? name : ConfigServer.SystemPrefix + 'metadata';
        };
        return RepositoryFactory;
    })();
    Services.RepositoryFactory = RepositoryFactory;
})(Services = exports.Services || (exports.Services = {}));
//# sourceMappingURL=RepositoryFactory.js.map