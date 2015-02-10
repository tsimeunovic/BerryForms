/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/repository/IQueryCreatorService.ts" />

'use strict';

module Mocks {
    export class QueryCreatorServiceMock implements Services.IQueryCreatorService {
        constructor() {
            this.Setup();
        }

        private Setup() {
            spyOn(this, 'CreateRelationSearchQuery').and.callThrough();
        }

        public CreateRelationSearchQuery(entityMetadata:Models.EntityMetadata, searchExpression:string):any {
            return searchExpression;
        }
    }
}
