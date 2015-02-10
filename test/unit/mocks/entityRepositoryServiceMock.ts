/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/repository/IEntityRepositoryService.ts" />

'use strict';

module Mocks {
    export class EntityRepositoryServiceMock implements Services.IEntityRepositoryService {
        constructor() {
            this.Setup();
        }

        private Setup():void {
            this.Responses = [];

            spyOn(this, 'LoadEntityMetadata').and.callThrough();
            spyOn(this, 'SaveEntityMetadata').and.callThrough();
            spyOn(this, 'LoadAllEntityMetadata').and.callThrough();
            spyOn(this, 'LoadEntity').and.callThrough();
            spyOn(this, 'SaveEntity').and.callThrough();
            spyOn(this, 'DeleteEntity').and.callThrough();
            spyOn(this, 'LoadAllEntities').and.callThrough();
            spyOn(this, 'LoadPagedEntities').and.callThrough();
            spyOn(this, 'LoadSearchResults').and.callThrough();
            spyOn(this, 'LoadPagedFilteredResults').and.callThrough();
        }

        private Responses:any[];

        //Mock methods
        public AddResponse(method:string, result:any, errorModel:any) {
            this.Responses.push({
                Method: method,
                Result: result,
                ErrorModel: errorModel,
                AnyResponse: result != null || errorModel != null
            });
        }

        private ResponseFor(method:string):any {
            var configuredResponsePredicate = function (response) {
                return response.Method == method
            };
            return this.Responses.single(configuredResponsePredicate);
        }

        //Interface implementation
        public LoadEntityMetadata(entityName:string, callback:(metadata:Models.EntityMetadata, errorsModel:any)=>void):void {
            var defaultObject = new Models.EntityMetadata();

            var configuredResponse = this.ResponseFor('LoadEntityMetadata');
            if (configuredResponse && configuredResponse.AnyResponse) callback(configuredResponse.Result, configuredResponse.ErrorModel);
            else if (!configuredResponse) callback(defaultObject, null);
        }

        public SaveEntityMetadata(entityMetadata:Models.EntityMetadata, callback:(savedMetadata:Models.EntityMetadata, errorsModel:any)=>void):void {
            var defaultObject = new Models.EntityMetadata();

            var configuredResponse = this.ResponseFor('SaveEntityMetadata');
            if (configuredResponse && configuredResponse.AnyResponse) callback(configuredResponse.Result, configuredResponse.ErrorModel);
            else if (!configuredResponse) callback(defaultObject, null);
        }

        public LoadAllEntityMetadata(callback:(entities:Models.EntityMetadata[], errorsModel:any)=>void):void {
            var defaultObject = [];
            var m1 = new Models.EntityMetadata();
            m1.EntitySystemName = 'Metadata1';
            defaultObject.push(m1);
            var m2 = new Models.EntityMetadata();
            m2.EntitySystemName = 'Metadata2';
            defaultObject.push(m2);
            var m3 = new Models.EntityMetadata();
            m3.EntitySystemName = 'Metadata3';
            defaultObject.push(m3);
            var m4 = new Models.EntityMetadata();
            m4.EntitySystemName = 'Metadata4';
            defaultObject.push(m4);

            var configuredResponse = this.ResponseFor('LoadAllEntityMetadata');
            if (configuredResponse && configuredResponse.AnyResponse) callback(configuredResponse.Result, configuredResponse.ErrorModel);
            else if (!configuredResponse) callback(defaultObject, null);
        }

        public LoadEntity(entityName:string, entityId:number, callback:(entity:Models.Entity, errorsModel:any)=>void):void {
            var defaultObject = new Models.Entity('RepositoryMockEntity');
            defaultObject.Id = entityId;
            defaultObject.EntitySystemName = entityName;

            var configuredResponse = this.ResponseFor('LoadEntity');
            if (configuredResponse && configuredResponse.AnyResponse) callback(configuredResponse.Result, configuredResponse.ErrorModel);
            else if (!configuredResponse) callback(defaultObject, null);
        }

        public SaveEntity(entity:Models.Entity, callback:(savedEntity:Models.Entity, errorsModel:any)=>void):void {
            var defaultObject = new Models.Entity('RepositoryMockEntity');
            defaultObject.Id = 12;

            var configuredResponse = this.ResponseFor('SaveEntity');
            if (configuredResponse && configuredResponse.AnyResponse) callback(configuredResponse.Result, configuredResponse.ErrorModel);
            else if (!configuredResponse) callback(defaultObject, null);
        }

        public DeleteEntity(entity:Models.Entity, callback:(deletedEntity:Models.Entity, errorsModel:any)=>void):void {
            var defaultObject = new Models.Entity('RepositoryMockEntity');
            defaultObject.Id = 14;

            var configuredResponse = this.ResponseFor('DeleteEntity');
            if (configuredResponse && configuredResponse.AnyResponse) callback(configuredResponse.Result, configuredResponse.ErrorModel);
            else if (!configuredResponse) callback(defaultObject, null);
        }

        public LoadAllEntities(entityName:string, callback:(entities:Models.Entity[], errorsModel:any)=>void):void {
            var defaultObject = [
                new Models.Entity(entityName),
                new Models.Entity(entityName),
                new Models.Entity(entityName),
                new Models.Entity(entityName),
                new Models.Entity(entityName),
                new Models.Entity(entityName)
            ];

            var configuredResponse = this.ResponseFor('LoadAllEntities');
            if (configuredResponse && configuredResponse.AnyResponse) callback(configuredResponse.Result, configuredResponse.ErrorModel);
            else if (!configuredResponse) callback(defaultObject, null);
        }

        public LoadPagedEntities(entityName:string, pageIndex:number, pageSize:number, callback:(pagedData:any, errorsModel:any)=>void):void {
            var defaultObject = {
                EntitySystemName: entityName,
                Query: null,
                Page: {
                    PageIndex: pageIndex,
                    TotalCount: pageSize * 10 + 2,
                    TotalPages: 11,
                    StartIndex: pageIndex * pageSize,
                    LoadedCount: 2 * pageSize,
                    VersionIdentifier: 1024
                },
                List: []
            };
            for (var i = 0; i < 2 * pageSize; i++) {
                var entity = new Models.Entity(entityName);
                entity.Id = pageIndex * pageSize + i + 1;
                defaultObject.List.push(entity);
            }

            var configuredResponse = this.ResponseFor('LoadPagedEntities');
            if (configuredResponse && configuredResponse.AnyResponse) callback(configuredResponse.Result, configuredResponse.ErrorModel);
            else if (!configuredResponse) callback(defaultObject, null);
        }

        public LoadSearchResults(entityMetadata:Models.EntityMetadata, searchExpression:string, callback:(searchExpression:string, searchResults:Models.SelectFieldOptionMetadata[], totalResultsCount:number, errorsModel:any)=>void):void {
            var defaultObject = [
                new Models.SelectFieldOptionMetadata('RepositoryMockSelectOption', null),
                new Models.SelectFieldOptionMetadata('RepositoryMockSelectOption', null),
                new Models.SelectFieldOptionMetadata('RepositoryMockSelectOption', null),
                new Models.SelectFieldOptionMetadata('RepositoryMockSelectOption', null)
            ];

            var configuredResponse = this.ResponseFor('LoadSearchResults');
            if (configuredResponse && configuredResponse.AnyResponse) callback(searchExpression, configuredResponse.Result, 20, configuredResponse.ErrorModel);
            else if (!configuredResponse) callback(searchExpression, defaultObject, 20, null);
        }

        public LoadPagedFilteredResults(entityName:string, query:any, pageIndex:number, pageSize:number, callback:(pagedData:any, errorsModel:any)=>void):void {
            var defaultObject = {
                EntitySystemName: entityName,
                Query: query,
                Page: {
                    PageIndex: pageIndex,
                    TotalCount: pageSize * 4 + 1,
                    TotalPages: 5,
                    StartIndex: pageIndex * pageSize,
                    LoadedCount: 2 * pageSize,
                    VersionIdentifier: 1024
                },
                List: []
            };
            for (var i = 0; i < 2 * pageSize; i++) {
                var entity = new Models.Entity(entityName);
                entity.Id = pageIndex * pageSize + i + 1;
                defaultObject.List.push(entity);
            }

            var configuredResponse = this.ResponseFor('LoadPagedFilteredResults');
            if (configuredResponse && configuredResponse.AnyResponse) callback(configuredResponse.Result, configuredResponse.ErrorModel);
            else if (!configuredResponse) callback(defaultObject, null);
        }
    }
}
