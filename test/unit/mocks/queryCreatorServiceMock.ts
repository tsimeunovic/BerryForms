/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/repository/IQueryCreatorService.ts" />

module Mocks {
    'use strict';

    export class QueryCreatorServiceMock implements Services.IQueryCreatorService {
        constructor() {
            this.Setup();
        }

        public CreateRelationSearchQuery(entityMetadata:Models.EntityMetadata, searchExpression:string):any {
            return searchExpression;
        }

        private Setup():void {
            spyOn(this, 'CreateRelationSearchQuery').and.callThrough();
        }
    }
}
