/// <reference path="../data/IRepository.ts" />

'use strict';

import ChildContract = require('../data/IRepository');

export module Services {
    export interface IRepositoryFactory {
        CreateRepositoryFor(type:string, name:string): ChildContract.Data.IRepository<any>;
    }
}