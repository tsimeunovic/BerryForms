/// <reference path="../../../models/entityMetadataModel.ts" />

'use strict';

//Interface for Query creator service (creates database query)
module Services {
    export interface IQueryCreatorService {
        CreateRelationSearchQuery(entityMetadata:Models.EntityMetadata, searchExpression:string):any;
    }
}
