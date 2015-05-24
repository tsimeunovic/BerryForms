/// <reference path="../GlobalReferences.ts" />
/// <reference path="./IRepositoryFactory.ts" />

import Contract = require('../services/IRepositoryFactory');
import ChildContract = require('../data/common/IMongoRepository');
import MongoRepository = require('../data/common/MongoRepository');
var ConfigServer:any = require('../config/Config').Config.Server;

export module Services {
    'use strict';

    export class RepositoryFactory implements Contract.Services.IRepositoryFactory {
        public CreateRepositoryFor(type:string, name:string):ChildContract.Data.IMongoRepository<any> {
            var collectionName:string = this.GetCollectionNameFor(type, name);
            return new MongoRepository.Data.MongoRepository(collectionName);
        }

        private GetCollectionNameFor(type:string, name:string):string {
            //TODO: Return null and create no repository for unknown type
            return type === 'entity' ? name : ConfigServer.SystemPrefix + 'metadata';
        }
    }
}
