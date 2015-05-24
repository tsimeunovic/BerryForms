/// <reference path="../../GlobalReferences.ts" />
/// <reference path="../common/IMongoRepository.ts" />
/// <reference path="../entity/IEntityRepository.ts" />
/// <reference path="./IDashboardRepository.ts" />
/// <reference path="../../services/IRepositoryFactory.ts" />
var ConfigServer = require('../../config/Config');
var RepositoryFactory = require('../../services/RepositoryFactory');
var Data;
(function (Data) {
    'use strict';
    var DashboardRepository = (function () {
        function DashboardRepository(EntityRepository) {
            this.EntityRepository = EntityRepository;
        }
        DashboardRepository.prototype.GetRecentActivity = function (request, callback) {
            this.GetActivityLog(null, request, callback);
        };
        DashboardRepository.prototype.GetMyRecentActivity = function (request, callback) {
            this.GetActivityLog(request.session.User.UserName, request, callback);
        };
        DashboardRepository.prototype.GetEntitiesActivitySummary = function (request, callback) {
            var _this = this;
            //Retrieve users entity
            this.GetAllUsersEntities(request, function (entitiesList, errors) {
                //Get user activity for those entities
                var repository = _this.CreateRepositoryForDashboard();
                repository.GetEntitiesSummary(entitiesList, ConfigServer.Config.Server.LogSummaryMinutes, callback);
            });
        };
        DashboardRepository.prototype.CreateRepositoryForDashboard = function () {
            var factory = new RepositoryFactory.Services.RepositoryFactory();
            return factory.CreateRepositoryFor('metadata', null);
        };
        DashboardRepository.prototype.GetAllUsersEntities = function (request, callback) {
            request.params.type = 'metadata';
            this.EntityRepository.GetAll(request, function (data, errors) {
                if (errors) {
                    callback(null, errors);
                }
                else {
                    var mappingEntityNameFunction = function (element) {
                        return element.EntitySystemName;
                    };
                    var mappedUserEntities = data.map(mappingEntityNameFunction);
                    callback(mappedUserEntities, null);
                }
            });
        };
        DashboardRepository.prototype.GetActivityLog = function (userName, request, callback) {
            var _this = this;
            //Retrieve users entity
            this.GetAllUsersEntities(request, function (entitiesList, errors) {
                //Get user activity for those entities
                var repository = _this.CreateRepositoryForDashboard();
                repository.GetLatestLogRecordsFor(userName, entitiesList, ConfigServer.Config.Server.LogRetrieveCount, callback);
            });
        };
        return DashboardRepository;
    })();
    Data.DashboardRepository = DashboardRepository;
})(Data = exports.Data || (exports.Data = {}));
//# sourceMappingURL=DashboardRepository.js.map