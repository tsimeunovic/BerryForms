/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/repository/IUrlLocatorService.ts" />

'use strict';

module Mocks {
    export class UrlLocatorServiceMock implements Services.IUrlLocatorService {
        public GetUrlForEntityMetadataListRetrieve():string {
            return 'EntityMetadataListRetrieve';
        }

        public GetUrlForEntityMetadataRetrieve(entityName:string):string {
            return 'EntityMetadataRetrieve/' + entityName;
        }

        public GetUrlForEntityMetadataSave(entityName:string):string {
            return 'EntityMetadataSave/' + entityName;
        }

        public GetUrlForEntityListRetrieve(entityName:string):string {
            return 'EntityListRetrieve/' + entityName;
        }

        public GetUrlForPagedEntityListRetrieve(entityName:string, pageNumber:number, pageSize:number):string {
            return 'PagedEntityListRetrieve/' + entityName + '/' + pageNumber + '/' + pageSize;
        }

        public GetUrlForFilteredListRetrieve(entityName:string, pageNumber:number, pageSize:number):string {
            return 'FilteredListRetrieve/' + entityName + '/' + pageNumber + '/' + pageSize;
        }

        public GetUrlForEntityRetrieve(entityName:string, entityId:number):string {
            return 'EntityRetrieve/' + entityName + '/' + entityId;
        }

        public GetUrlForEntitySave(entityName:string):string {
            return 'EntitySave/' + entityName;
        }

        public GetUrlForEntityDelete(entityName:string, entityId:number):string {
            return 'EntityDelete/' + entityName + '/' + entityId;
        }

        public GetUrlForLogin():string {
            return 'Login';
        }

        public GetUrlForDashboardActivitySummary(entityName:string):string {
            return 'DashboardActivitySummary/' + entityName;
        }
    }
}
