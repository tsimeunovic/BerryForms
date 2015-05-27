/// <reference path="../../GlobalReferences.ts" />
/// <reference path="../common/IMongoRepository.ts" />
/// <reference path="../entity/IEntityRepository.ts" />
/// <reference path="./IDashboardRepository.ts" />
/// <reference path="../../services/IRepositoryFactory.ts" />

import ConfigServer = require('../../config/Config');
import Contract = require('IDashboardRepository');
import DbContract = require('../common/IMongoRepository');
import EntityRepositoryContract = require('../entity/IEntityRepository');
import ErrorsModel = require('../../model/ClientErrorsModel');
import RepositoryFactory = require('../../services/RepositoryFactory');

export module Data {
    'use strict';

    export class DashboardRepository implements Contract.Data.IDashboardRepository {
        constructor(private EntityRepository:EntityRepositoryContract.Data.IEntityRepository<any>) {
        }

        public GetLastActivity(request:any, callback:(data:any[], errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            this.GetActivityLog(null, request, callback);
        }

        public GetMyLastActivity(request:any, callback:(data:any[], errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            this.GetActivityLog(request.session.User.UserName, request, callback);
        }

        public GetEntitiesActivitySummary(request:any, callback:(data:any[], errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            var _this:DashboardRepository = this;

            //Retrieve users entity
            this.GetAllUsersEntities(request, function (entitiesList:string[], errors:ErrorsModel.Model.ClientErrorsModel):void {
                //Get user activity for those entities
                var repository:DbContract.Data.IMongoRepository<any> = _this.CreateRepositoryForDashboard();
                repository.GetEntitiesSummary(entitiesList, ConfigServer.Config.Server.LogSummaryMinutes, callback);
            });
        }

        private CreateRepositoryForDashboard():DbContract.Data.IMongoRepository<any> {
            var factory:RepositoryFactory.Services.RepositoryFactory = new RepositoryFactory.Services.RepositoryFactory();
            return factory.CreateRepositoryFor('metadata', null);
        }

        private GetAllUsersEntities(request:any, callback:(data:any[], errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            request.params.type = 'metadata';
            this.EntityRepository.GetAll(request, function (data:any[], errors:ErrorsModel.Model.ClientErrorsModel):void {
                if (errors) {
                    callback(null, errors);
                } else {
                    var mappingEntityNameFunction:(e:any) => string = function (element:any):string {
                        return element.EntitySystemName;
                    };
                    var mappedUserEntities:string[] = data.map(mappingEntityNameFunction);
                    callback(mappedUserEntities, null);
                }
            });
        }

        private GetActivityLog(userName:string, request:any, callback:(data:any[], errors:ErrorsModel.Model.ClientErrorsModel) => void):void {
            var _this:DashboardRepository = this;

            //Retrieve users entity
            this.GetAllUsersEntities(request, function (entitiesList:string[], errors:ErrorsModel.Model.ClientErrorsModel):void {
                //Get user activity for those entities
                var repository:DbContract.Data.IMongoRepository<any> = _this.CreateRepositoryForDashboard();
                repository.GetLatestLogRecordsFor(userName, entitiesList, ConfigServer.Config.Server.LogRetrieveCount, callback);
            });
        }
    }
}
