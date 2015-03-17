/// <reference path="../GlobalReferences.ts" />
/// <reference path="./IRepositoryFactory.ts" />
'use strict';
var MongoRepository = require('../data/common/MongoRepository');
var ConfigServer = require('../config/Config').Config.Server;
var Services;
(function (Services) {
    var RepositoryFactory = (function () {
        function RepositoryFactory() {
        }
        RepositoryFactory.prototype.GetCollectionNameFor = function (type, name) {
            return type == 'entity' ? name : ConfigServer.SystemPrefix + 'metadata';
        };
        RepositoryFactory.prototype.CreateRepositoryFor = function (type, name) {
            var collectionName = this.GetCollectionNameFor(type, name);
            return new MongoRepository.Data.MongoRepository(collectionName);
        };
        return RepositoryFactory;
    })();
    Services.RepositoryFactory = RepositoryFactory;
})(Services = exports.Services || (exports.Services = {}));
//# sourceMappingURL=RepositoryFactory.js.map