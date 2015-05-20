/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/repository/IEntityRepositoryService.ts" />

module Mocks {
    'use strict';

    export class EntityRepositoryServiceMock implements Services.IEntityRepositoryService {
        constructor() {
            this.Setup();
        }

        private Responses:any[];

        //Mock methods
        public AddResponse(method:string, result:any, errorModel:any):void {
            this.Responses.push({
                Method: method,
                Result: result,
                ErrorModel: errorModel,
                AnyResponse: result != null || errorModel != null
            });
        }

        //Interface implementation
        public LoadEntityMetadata(entityName:string, callback:(metadata:Models.EntityMetadata, errorsModel:any) => void):void {
            var defaultObject:Models.EntityMetadata = new Models.EntityMetadata();

            var configuredResponse:any = this.ResponseFor('LoadEntityMetadata');
            if (configuredResponse && configuredResponse.AnyResponse) {
                callback(configuredResponse.Result, configuredResponse.ErrorModel);
            } else if (!configuredResponse) {
                callback(defaultObject, null);
            }
        }

        public SaveEntityMetadata(entityMetadata:Models.EntityMetadata, callback:(savedMetadata:Models.EntityMetadata, errorsModel:any) => void):void {
            var defaultObject:Models.EntityMetadata = new Models.EntityMetadata();

            var configuredResponse:any = this.ResponseFor('SaveEntityMetadata');
            if (configuredResponse && configuredResponse.AnyResponse) {
                callback(configuredResponse.Result, configuredResponse.ErrorModel);
            } else if (!configuredResponse) {
                callback(defaultObject, null);
            }
        }

        public LoadAllEntityMetadata(callback:(entities:Models.EntityMetadata[], errorsModel:any) => void):void {
            var defaultObject:Models.EntityMetadata[] = [];
            var m1:Models.EntityMetadata = new Models.EntityMetadata();
            m1.EntitySystemName = 'Metadata1';
            defaultObject.push(m1);
            var m2:Models.EntityMetadata = new Models.EntityMetadata();
            m2.EntitySystemName = 'Metadata2';
            defaultObject.push(m2);
            var m3:Models.EntityMetadata = new Models.EntityMetadata();
            m3.EntitySystemName = 'Metadata3';
            defaultObject.push(m3);
            var m4:Models.EntityMetadata = new Models.EntityMetadata();
            m4.EntitySystemName = 'Metadata4';
            defaultObject.push(m4);

            var configuredResponse:any = this.ResponseFor('LoadAllEntityMetadata');
            if (configuredResponse && configuredResponse.AnyResponse) {
                callback(configuredResponse.Result, configuredResponse.ErrorModel);
            } else if (!configuredResponse) {
                callback(defaultObject, null);
            }
        }

        public LoadEntity(entityName:string, entityId:number, callback:(entity:Models.Entity, errorsModel:any) => void):void {
            var defaultObject:Models.Entity = new Models.Entity('RepositoryMockEntity');
            defaultObject.Id = entityId;
            defaultObject.EntitySystemName = entityName;

            var configuredResponse:any = this.ResponseFor('LoadEntity');
            if (configuredResponse && configuredResponse.AnyResponse) {
                callback(configuredResponse.Result, configuredResponse.ErrorModel);
            } else if (!configuredResponse) {
                callback(defaultObject, null);
            }
        }

        public SaveEntity(entity:Models.Entity, callback:(savedEntity:Models.Entity, errorsModel:any) => void):void {
            var defaultObject:Models.Entity = new Models.Entity('RepositoryMockEntity');
            defaultObject.Id = 12;

            var configuredResponse:any = this.ResponseFor('SaveEntity');
            if (configuredResponse && configuredResponse.AnyResponse) {
                callback(configuredResponse.Result, configuredResponse.ErrorModel);
            } else if (!configuredResponse) {
                callback(defaultObject, null);
            }
        }

        public DeleteEntity(entity:Models.Entity, callback:(deletedEntity:Models.Entity, errorsModel:any) => void):void {
            var defaultObject:Models.Entity = new Models.Entity('RepositoryMockEntity');
            defaultObject.Id = 14;

            var configuredResponse:any = this.ResponseFor('DeleteEntity');
            if (configuredResponse && configuredResponse.AnyResponse) {
                callback(configuredResponse.Result, configuredResponse.ErrorModel);
            } else if (!configuredResponse) {
                callback(defaultObject, null);
            }
        }

        public LoadAllEntities(entityName:string, callback:(entities:Models.Entity[], errorsModel:any) => void):void {
            var defaultObject:Models.Entity[] = [
                new Models.Entity(entityName),
                new Models.Entity(entityName),
                new Models.Entity(entityName),
                new Models.Entity(entityName),
                new Models.Entity(entityName),
                new Models.Entity(entityName)
            ];

            var configuredResponse:any = this.ResponseFor('LoadAllEntities');
            if (configuredResponse && configuredResponse.AnyResponse) {
                callback(configuredResponse.Result, configuredResponse.ErrorModel);
            } else if (!configuredResponse) {
                callback(defaultObject, null);
            }
        }

        public LoadPagedEntities(entityName:string, pageIndex:number, pageSize:number, callback:(pagedData:any, errorsModel:any) => void):void {
            var defaultObject:any = {
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

            for (var i:number = 0; i < 2 * pageSize; i++) {
                var entity:Models.Entity = new Models.Entity(entityName);
                entity.Id = pageIndex * pageSize + i + 1;
                defaultObject.List.push(entity);
            }

            var configuredResponse:any = this.ResponseFor('LoadPagedEntities');
            if (configuredResponse && configuredResponse.AnyResponse) {
                callback(configuredResponse.Result, configuredResponse.ErrorModel);
            } else if (!configuredResponse) {
                callback(defaultObject, null);
            }
        }

        public LoadSearchResults(entityMetadata:Models.EntityMetadata, searchExpression:string,
                                 callback:(searchExpression:string, searchResults:Models.SelectFieldOptionMetadata[],
                                           totalResultsCount:number, errorsModel:any) => void):void {
            var defaultObject:Models.SelectFieldOptionMetadata[] = [
                new Models.SelectFieldOptionMetadata('RepositoryMockSelectOption', null),
                new Models.SelectFieldOptionMetadata('RepositoryMockSelectOption', null),
                new Models.SelectFieldOptionMetadata('RepositoryMockSelectOption', null),
                new Models.SelectFieldOptionMetadata('RepositoryMockSelectOption', null)
            ];

            var configuredResponse:any = this.ResponseFor('LoadSearchResults');
            if (configuredResponse && configuredResponse.AnyResponse) {
                callback(searchExpression, configuredResponse.Result, 20, configuredResponse.ErrorModel);
            } else if (!configuredResponse) {
                callback(searchExpression, defaultObject, 20, null);
            }
        }

        public LoadPagedFilteredResults(entityName:string, query:any, pageIndex:number, pageSize:number,
                                        callback:(pagedData:any, errorsModel:any) => void):void {
            var defaultObject:any = {
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
            for (var i:number = 0; i < 2 * pageSize; i++) {
                var entity:Models.Entity = new Models.Entity(entityName);
                entity.Id = pageIndex * pageSize + i + 1;
                defaultObject.List.push(entity);
            }

            var configuredResponse:any = this.ResponseFor('LoadPagedFilteredResults');
            if (configuredResponse && configuredResponse.AnyResponse) {
                callback(configuredResponse.Result, configuredResponse.ErrorModel);
            } else if (!configuredResponse) {
                callback(defaultObject, null);
            }
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

        private ResponseFor(method:string):any {
            var configuredResponsePredicate:(r:any) => boolean = function (response:any):boolean {
                return response.Method === method;
            };
            return this.Responses.single(configuredResponsePredicate);
        }
    }
}
