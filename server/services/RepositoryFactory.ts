/// <reference path="../GlobalReferences.ts" />
/// <reference path="./IRepositoryFactory.ts" />

'use strict';

import Contract = require('../services/IRepositoryFactory');
import ChildContract = require('../data/common/IMongoRepository');
import MongoRepository = require('../data/common/MongoRepository');
var ConfigServer:any = require('../config/Config').Config.Server;

export module Services {
    export class RepositoryFactory implements Contract.Services.IRepositoryFactory {
        private GetCollectionNameFor(type:string, name:string) {
            return type == 'entity' ? name : ConfigServer.SystemPrefix + 'metadata';
        }

        public CreateRepositoryFor(type:string, name:string):ChildContract.Data.IMongoRepository<any> {
            var collectionName = this.GetCollectionNameFor(type, name);
            return new MongoRepository.Data.MongoRepository(collectionName);
        }
    }
}