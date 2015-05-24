/// <reference path="../data/common/IMongoRepository.ts" />

import ChildContract = require('../data/common/IMongoRepository');

export module Services {
    'use strict';

    export interface IRepositoryFactory {
        CreateRepositoryFor(type:string, name:string): ChildContract.Data.IMongoRepository<any>;
    }
}
