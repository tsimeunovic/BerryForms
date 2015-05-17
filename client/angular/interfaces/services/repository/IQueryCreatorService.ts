/// <reference path="../../../models/core/entityMetadataModel.ts" />

//Interface for Query creator service (creates database query)
module Services {
    'use strict';

    export interface IQueryCreatorService {
        CreateRelationSearchQuery(entityMetadata:Models.EntityMetadata, searchExpression:string):any;
    }
}
