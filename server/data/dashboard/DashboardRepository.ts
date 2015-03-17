/// <reference path="../../GlobalReferences.ts" />
/// <reference path="../common/IMongoRepository.ts" />
/// <reference path="../entity/IEntityRepository.ts" />
/// <reference path="./IDashboardRepository.ts" />
/// <reference path="../../services/IRepositoryFactory.ts" />

'use strict';
import ConfigServer = require('../../config/Config');
import Contract = require('IDashboardRepository');
import DbContract = require('../common/IMongoRepository');
import EntityRepositoryContract = require('../entity/IEntityRepository');
import ChildContract = require('../common/IMongoRepository');
import ErrorsModel = require('../../model/ClientErrorsModel');
import RepositoryFactoryContract = require('../../services/IRepositoryFactory');
import RepositoryFactory = require('../../services/RepositoryFactory');

export module Data {
    export class DashboardRepository implements Contract.Data.IDashboardRepository {
        constructor(private EntityRepository:EntityRepositoryContract.Data.IEntityRepository<any>) {
        }

        private CreateRepositoryForDashboard():DbContract.Data.IMongoRepository<any> {
            var factory = new RepositoryFactory.Services.RepositoryFactory();
            return factory.CreateRepositoryFor('metadata', null);
        }

        private GetAllUsersEntities(request:any, callback:(data:any[], errors:ErrorsModel.Model.ClientErrorsModel)=>void) {
            request.params.type = 'metadata';
            this.EntityRepository.GetAll(request, function (data:any[], errors:ErrorsModel.Model.ClientErrorsModel):void {
                if (errors) {
                    callback(null, errors);
                }
                else {
                    var mappingEntityNameFunction:(any)=>string = function (element:any) {
                        return element.EntitySystemName;
                    };
                    var mappedUserEntities:string[] = data.map(mappingEntityNameFunction);
                    callback(mappedUserEntities, null);
                }
            });
        }

        private GetActivityLog(userName:string, request:any, callback:(data:any[], errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var _this = this;

            //Retrieve users entity
            this.GetAllUsersEntities(request, function (entitiesList:string[], errors:ErrorsModel.Model.ClientErrorsModel) {
                //Get user activity for those entities
                var repository = _this.CreateRepositoryForDashboard();
                repository.GetLatestLogRecordsFor(userName, entitiesList, ConfigServer.Config.Server.LogRetrieveCount, callback);
            });
        }

        public GetRecentActivity(request:any, callback:(data:any[], errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            this.GetActivityLog(null, request, callback);
        }

        public GetMyRecentActivity(request:any, callback:(data:any[], errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            this.GetActivityLog(request.session.User.UserName, request, callback);
        }

        public GetEntitiesActivitySummary(request:any, callback:(data:any[], errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var _this = this;

            //Retrieve users entity
            this.GetAllUsersEntities(request, function (entitiesList:string[], errors:ErrorsModel.Model.ClientErrorsModel) {
                //Get user activity for those entities
                var repository = _this.CreateRepositoryForDashboard();
                repository.GetEntitiesSummary(entitiesList, ConfigServer.Config.Server.LogSummaryMinutes, callback);
            });
        }
    }
}