///<reference path="../../../client/angular/models/core/entityModel.ts"/>
///<reference path="../../../client/angular/models/core/entityMetadataModel.ts"/>
///<reference path="../../../client/angular/interfaces/services/mapping/IFilterConverterService.ts"/>

'use strict';

module Mocks {
    export class FilterConverterServiceMock implements Services.IFilterConverterService {
        constructor() {
            this.Setup();
        }

        private Setup():void {
            spyOn(this, 'CreateDatabaseQueryFromFilter').and.callThrough();
            spyOn(this, 'CreateFilterFormMetadataFromEntityMetadata').and.callThrough();
            spyOn(this, 'ParseFilterQueryString').and.callThrough();
            spyOn(this, 'CreateFilterQueryString').and.callThrough();
        }

        public CreateDatabaseQueryFromFilter(metadata:Models.EntityMetadata, filterEntity:Models.Entity):any {
            return {'MockField': 'MockFilterValue'};
        }

        public CreateFilterFormMetadataFromEntityMetadata(metadata:Models.EntityMetadata):Models.EntityMetadata {
            var filterFormMetadata:Models.EntityMetadata = new Models.EntityMetadata();
            filterFormMetadata.Fields = [
                new Models.FieldMetadata('Mock'),
                new Models.FieldMetadata('Mock'),
                new Models.FieldMetadata('Mock'),
                new Models.FieldMetadata('Mock')
            ];
            return filterFormMetadata;
        }

        public ParseFilterQueryString(metadata:Models.EntityMetadata, routeParams:any):Models.Entity {
            return new Models.Entity('MockFilterEntity');
        }

        public CreateFilterQueryString(metadata:Models.EntityMetadata, filterEntity:Models.Entity):string {
            return 'mockQueryParam1=mockValue1&mockQueryParam2=mockValue2';
        }
    }
}
