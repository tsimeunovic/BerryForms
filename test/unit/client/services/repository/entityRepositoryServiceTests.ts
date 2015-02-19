/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/httpMock.ts" />
/// <reference path="../../../mocks/callbackMock.ts" />
/// <reference path="../../../mocks/urlLocatorServiceMock.ts" />
/// <reference path="../../../mocks/entityModelMapperServiceMock.ts" />
/// <reference path="../../../mocks/queryCreatorServiceMock.ts" />
/// <reference path="../../../mocks/pluginsExecutorServiceMock.ts" />
/// <reference path="../../../../../client/angular/services/repository/entityRepositoryService.ts" />

'use strict';

describe('Service: EntityRepositoryService', function () {
    var systemUnderTest:Services.EntityRepositoryService;
    var httpWrapperServiceMock:Mocks.HttpWrapperServiceMock;
    var callbackMock:Mocks.CallbackMock;
    var urlLocatorServiceMock:Services.IUrlLocatorService;
    var entityModelMapperServiceMock:Services.IEntityModelMapperService;
    var queryCreatorServiceMock:Services.IQueryCreatorService;
    var pluginsExecutorServiceMock:Mocks.PluginsExecutorServiceMock;

    beforeEach(function () {
        httpWrapperServiceMock = new Mocks.HttpWrapperServiceMock();
        callbackMock = new Mocks.CallbackMock();
        urlLocatorServiceMock = new Mocks.UrlLocatorServiceMock();
        entityModelMapperServiceMock = new Mocks.EntityModelMapperServiceMock();
        queryCreatorServiceMock = new Mocks.QueryCreatorServiceMock();
        pluginsExecutorServiceMock = new Mocks.PluginsExecutorServiceMock(false);

        systemUnderTest = new Services.EntityRepositoryService(httpWrapperServiceMock, urlLocatorServiceMock, entityModelMapperServiceMock, queryCreatorServiceMock, pluginsExecutorServiceMock);
    });

    it('should deserialize data returned from \'LoadEntityMetadata\'', function () {
        //Arrange
        var callback:any = callbackMock.callback;
        var returnedMetadata = new Models.EntityMetadata();
        httpWrapperServiceMock.AddResponse('get', 'EntityMetadataRetrieve/entityName', returnedMetadata, 200);

        //Act
        systemUnderTest.LoadEntityMetadata('entityName', callback);

        //Assert
        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0].EntityName).toEqual('MockMetadata');
        expect(callback.calls.first().args[1]).toEqual(null);
        var deserializeMethodMock:any = entityModelMapperServiceMock.DeserializeEntityMetadataModel;
        expect(deserializeMethodMock.calls.any()).toEqual(true);
        expect(deserializeMethodMock.calls.first().args[0]).toBe(returnedMetadata);
    });

    it('should return error model when \'LoadEntityMetadata\' fails', function () {
        //Arrange
        var callback:any = callbackMock.callback;
        var returnedError = {};
        httpWrapperServiceMock.AddResponse('get', 'EntityMetadataRetrieve/entityName', returnedError, 500);

        //Act
        systemUnderTest.LoadEntityMetadata('entityName', callback);

        //Assert
        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0]).toEqual(null);
        expect(callback.calls.first().args[1]).toBe(returnedError);
    });

    it('should cancel \'SaveEntityMetadata\' operation when plugin cancels it', function () {
        //Arrange
        pluginsExecutorServiceMock.SetCancellation(true);
        var callback:any = callbackMock.callback;
        var metadata = new Models.EntityMetadata();
        var postOperationMock:any = httpWrapperServiceMock.Post;

        //Act
        systemUnderTest.SaveEntityMetadata(metadata, callback);

        //Assert
        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0]).toEqual(null);
        expect(callback.calls.first().args[1]).toBe('CancellationErrorModelMock');
        expect(postOperationMock.calls.any()).toEqual(false);
    });

    it('should save entity and return it when \'SaveEntityMetadata\' is called', function () {
        //Arrange
        var callback:any = callbackMock.callback;
        var metadata = new Models.EntityMetadata();
        metadata.EntitySystemName = 'testEntity';
        var returnedModel = new Models.EntityMetadata();
        var postOperationMock:any = httpWrapperServiceMock.Post;
        httpWrapperServiceMock.AddResponse('post', 'EntityMetadataSave/testEntity', returnedModel, 200);

        //Act
        systemUnderTest.SaveEntityMetadata(metadata, callback);

        //Assert
        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0].EntityName).toEqual('MockMetadata');
        expect(callback.calls.first().args[1]).toEqual(null);
        expect(postOperationMock.calls.any()).toEqual(true);
        var deserializeMethodMock:any = entityModelMapperServiceMock.DeserializeEntityMetadataModel;
        expect(deserializeMethodMock.calls.any()).toEqual(true);
        expect(deserializeMethodMock.calls.first().args[0]).toBe(returnedModel);
    });

    it('should deserialize all returned metadata models that are returned to \'LoadAllEntityMetadata\'', function () {
        //Arrange
        var callback:any = callbackMock.callback;
        var returnedModel = [
            new Models.EntityMetadata(),
            new Models.EntityMetadata(),
            new Models.EntityMetadata()];
        var getOperationMock:any = httpWrapperServiceMock.Get;
        httpWrapperServiceMock.AddResponse('get', 'EntityMetadataListRetrieve', returnedModel, 200);

        //Act
        systemUnderTest.LoadAllEntityMetadata(callback);

        //Assert
        expect(getOperationMock.calls.any()).toEqual(true);
        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0].length).toEqual(3);
        expect(callback.calls.first().args[1]).toEqual(null);
        var deserializeMethodMock:any = entityModelMapperServiceMock.DeserializeEntityMetadataModel;
        expect(deserializeMethodMock.calls.count()).toEqual(3);
    });

    it('should retrieve entity and deserialize it when \'LoadEntity\' is called', function () {
        //Arrange
        var callback:any = callbackMock.callback;
        var returnedModel = new Models.Entity('TestReturnedEntity');
        var getOperationMock:any = httpWrapperServiceMock.Get;
        httpWrapperServiceMock.AddResponse('get', 'EntityRetrieve/name/8', returnedModel, 200);

        //Act
        systemUnderTest.LoadEntity('name', 8, callback);

        //Assert
        expect(getOperationMock.calls.any()).toEqual(true);
        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0].EntitySystemName).toEqual('EntityModelMapperServiceMockEntity');
        expect(callback.calls.first().args[1]).toEqual(null);
    });

    it('should save entity and return saved data when \'SaveEntity\' is called', function () {
        //Arrange
        var callback:any = callbackMock.callback;
        var entityToSave = new Models.Entity('TestSavingEntity');
        var returnedModel = new Models.Entity('TestReturnedEntity');
        var postOperationMock:any = httpWrapperServiceMock.Post;
        httpWrapperServiceMock.AddResponse('post', 'EntitySave/TestSavingEntity', returnedModel, 200);

        //Act
        systemUnderTest.SaveEntity(entityToSave, callback);

        //Assert
        expect(postOperationMock.calls.any()).toEqual(true);
        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0].EntitySystemName).toEqual('EntityModelMapperServiceMockEntity');
        expect(callback.calls.first().args[1]).toEqual(null);
        var deserializeMethodMock:any = entityModelMapperServiceMock.DeserializeEntityModel;
        expect(deserializeMethodMock.calls.any()).toEqual(true);
    });

    it('should delete entity and return deleted data when \'DeleteEntity\' is called', function () {
        //Arrange
        var callback:any = callbackMock.callback;
        var entityToDelete = new Models.Entity('TestDeletingEntity');
        entityToDelete.Id = 12;
        var returnedModel = new Models.Entity('TestReturnedEntity');
        var deleteOperationMock:any = httpWrapperServiceMock.Delete;
        httpWrapperServiceMock.AddResponse('delete', 'EntityDelete/TestDeletingEntity/12', returnedModel, 200);

        //Act
        systemUnderTest.DeleteEntity(entityToDelete, callback);

        //Assert
        expect(deleteOperationMock.calls.any()).toEqual(true);
        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0].EntitySystemName).toEqual('TestDeletingEntity');
        expect(callback.calls.first().args[1]).toEqual(null);
        var deserializeMethodMock:any = entityModelMapperServiceMock.DeserializeEntityModel;
        expect(deserializeMethodMock.calls.any()).toEqual(false);
    });

    it('should deserialize all entities returned by \'LoadAllEntities\'', function () {
        //Arrange
        var callback:any = callbackMock.callback;
        var returnedModel = [
            new Models.Entity('TestEntityName'),
            new Models.Entity('TestEntityName'),
            new Models.Entity('TestEntityName')
        ];
        var getOperationMock:any = httpWrapperServiceMock.Get;
        httpWrapperServiceMock.AddResponse('get', 'EntityListRetrieve/TestEntityName', returnedModel, 200);

        //Act
        systemUnderTest.LoadAllEntities('TestEntityName', callback);

        //Assert
        expect(getOperationMock.calls.any()).toEqual(true);
        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0].length).toEqual(3);
        expect(callback.calls.first().args[1]).toEqual(null);
        var deserializeMethodMock:any = entityModelMapperServiceMock.DeserializeEntityModel;
        expect(deserializeMethodMock.calls.count()).toEqual(3);
    });

    it('should return paging data and deserialized list of entities when \'LoadPagedEntities\' is called', function () {
        //Arrange
        var callback:any = callbackMock.callback;
        var returnedModel = {
            EntitySystemName: 'TestEntityName',
            Page: {
                PageNumber: 2,
                TotalCount: 150,
                StartIndex: 20,
                LoadedCount: 20,
                VersionIdentifier: 1024
            },
            List: [
                new Models.Entity('TestEntityName'),
                new Models.Entity('TestEntityName'),
                new Models.Entity('TestEntityName')
            ]
        };
        var getOperationMock:any = httpWrapperServiceMock.Get;
        httpWrapperServiceMock.AddResponse('get', 'PagedEntityListRetrieve/TestEntityName/2/10', returnedModel, 200);

        //Act
        systemUnderTest.LoadPagedEntities('TestEntityName', 2, 10, callback);

        //Assert
        expect(getOperationMock.calls.any()).toEqual(true);
        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0].EntitySystemName).toEqual(returnedModel.EntitySystemName);
        expect(callback.calls.first().args[0].Page).toEqual(returnedModel.Page);
        expect(callback.calls.first().args[0].List.length).toEqual(3);
        expect(callback.calls.first().args[1]).toEqual(null);
        var deserializeMethodMock:any = entityModelMapperServiceMock.DeserializeEntityModel;
        expect(deserializeMethodMock.calls.count()).toEqual(3);
    });

    it('should create search query and deserialize result when \'LoadSearchResults\' is called', function () {
        //Arrange
        var callback:any = callbackMock.callback;
        var searchedEntityMetadata = new Models.EntityMetadata();
        searchedEntityMetadata.EntitySystemName = 'TestSearchEntityMetadata';
        var searchExpression = 'TestSearchExpression';
        var returnedModel = {
            EntitySystemName: 'TestEntityName',
            Page: {
                PageNumber: 1,
                TotalCount: 15,
                StartIndex: 0,
                LoadedCount: 4,
                VersionIdentifier: 2048
            },
            List: [
                new Models.Entity('TestEntityName'),
                new Models.Entity('TestEntityName'),
                new Models.Entity('TestEntityName'),
                new Models.Entity('TestEntityName')
            ]
        };
        var postOperationMock:any = httpWrapperServiceMock.Post;
        httpWrapperServiceMock.AddResponse('post', 'FilteredListRetrieve/TestSearchEntityMetadata/0/2', returnedModel, 200);

        //Act
        systemUnderTest.LoadSearchResults(searchedEntityMetadata, searchExpression, callback);

        //Assert
        expect(postOperationMock.calls.any()).toEqual(true);
        expect(postOperationMock.calls.first().args[2]).toEqual('TestSearchExpression');
        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0]).toEqual(searchExpression);
        expect(callback.calls.first().args[1].length).toEqual(4);
        expect(callback.calls.first().args[2]).toEqual(returnedModel.Page.TotalCount);
        var deserializeSelectMock:any = entityModelMapperServiceMock.GetSelectFieldOptionFromEntityJson;
        expect(deserializeSelectMock.calls.count()).toEqual(4);
    });

    it('should return paging data and replace list with deserialized models when \'LoadPagedFilteredResults\' is called', function () {
        //Arrange
        var callback:any = callbackMock.callback;
        var queryObject = {a: 'abc'};
        var returnedModel = {
            EntitySystemName: 'TestEntityName',
            Page: {
                PageNumber: 1,
                TotalCount: 15,
                StartIndex: 0,
                LoadedCount: 4,
                VersionIdentifier: 2048
            },
            List: [
                new Models.Entity('TestEntityName'),
                new Models.Entity('TestEntityName'),
                new Models.Entity('TestEntityName'),
                new Models.Entity('TestEntityName')
            ]
        };
        var postOperationMock:any = httpWrapperServiceMock.Post;
        httpWrapperServiceMock.AddResponse('post', 'FilteredListRetrieve/TestEntityName/0/8', returnedModel, 200);

        //Act
        systemUnderTest.LoadPagedFilteredResults('TestEntityName', queryObject, 0, 8, callback);

        //Assert
        expect(postOperationMock.calls.any()).toEqual(true);
        expect(postOperationMock.calls.first().args[2]).toBe(queryObject);
        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0].Page).toBe(returnedModel.Page);
        expect(callback.calls.first().args[0].EntitySystemName).toBe(returnedModel.EntitySystemName);
        expect(callback.calls.first().args[0].List.length).toEqual(4);
        var deserializeMethodMock:any = entityModelMapperServiceMock.DeserializeEntityModel;
        expect(deserializeMethodMock.calls.count()).toEqual(4);
    });
});
