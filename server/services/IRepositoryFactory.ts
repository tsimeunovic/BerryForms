/// <reference path="../data/common/IMongoRepository.ts" />

'use strict';

import ChildContract = require('../data/common/IMongoRepository');

export module Services {
    export interface IRepositoryFactory {
        CreateRepositoryFor(type:string, name:string): ChildContract.Data.IMongoRepository<any>;
    }
}