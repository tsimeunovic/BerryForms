/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/callbackMock.ts" />
/// <reference path="../../../mocks/messagingServiceMock.ts" />
/// <reference path="../../../mocks/entityRepositoryServiceMock.ts" />
/// <reference path="../../../mocks/notificationServiceMock.ts" />
/// <reference path="../../../mocks/localizationServiceMock.ts" />
/// <reference path="../../../../../client/angular/services/state/entityListCacheService.ts" />

'use strict';

describe('Service: EntityListCacheService', function ():void {
    var systemUnderTest:Services.EntityListCacheService;
    var callbackMock:Mocks.CallbackMock;
    var messagingServiceMock:Services.IMessagingService;
    var entityRepositoryServiceMock:Mocks.EntityRepositoryServiceMock;
    var notificationServiceMock:Services.INotificationService;
    var localizationServiceMock:Services.ILocalizationService;

    beforeEach(function ():void {
        callbackMock = new Mocks.CallbackMock();
        messagingServiceMock = new Mocks.MessagingServiceMock();
        entityRepositoryServiceMock = new Mocks.EntityRepositoryServiceMock();
        notificationServiceMock = new Mocks.NotificationServiceMock();
        localizationServiceMock = new Mocks.LocalizationServiceMock();

        systemUnderTest = new Services.EntityListCacheService(messagingServiceMock,
            entityRepositoryServiceMock, notificationServiceMock, localizationServiceMock);
    });

    it('should call repository to retrieve data when they are not loaded', function ():void {
        //Arrange
        var callbackMockMethod:any = callbackMock.callback;
        var repositoryMockMethod:any = entityRepositoryServiceMock.LoadPagedFilteredResults;
        var dataLoadedMessagePublishMockMethod:any = messagingServiceMock.Messages.Cache.EntityList.DataLoaded.publish;

        //Act
        systemUnderTest.LoadEntityListPage('TestEntity', null, 0, callbackMockMethod);

        //Assert
        expect(repositoryMockMethod.calls.any()).toEqual(true);
        expect(repositoryMockMethod.calls.first().args[0]).toEqual('TestEntity');
        expect(repositoryMockMethod.calls.first().args[1]).toEqual(null);
        expect(repositoryMockMethod.calls.first().args[2]).toEqual(0);
        expect(repositoryMockMethod.calls.first().args[3]).toBeGreaterThan(0);
        expect(dataLoadedMessagePublishMockMethod.calls.any()).toEqual(true);
    });

    it('should not call repository when requested data are already available', function ():void {
        //Arrange
        var callbackMockMethod:any = callbackMock.callback;
        systemUnderTest.LoadEntityListPage('TestEntity', null, 0, callbackMockMethod);
        var repositoryMockMethod:any = entityRepositoryServiceMock.LoadPagedFilteredResults;
        var dataLoadedMessagePublishMockMethod:any = messagingServiceMock.Messages.Cache.EntityList.DataLoaded.publish;
        repositoryMockMethod.calls.reset();
        dataLoadedMessagePublishMockMethod.calls.reset();

        //Act
        systemUnderTest.LoadEntityListPage('TestEntity', null, 0, callbackMockMethod);

        //Assert
        expect(callbackMockMethod.calls.any()).toEqual(true);
        expect(repositoryMockMethod.calls.any()).toEqual(false);
        expect(dataLoadedMessagePublishMockMethod.calls.any()).toEqual(false);
    });

    it('should return existing data immediately and load next page when its not loaded', function ():void {
        //Arrange
        var callbackMockMethod:any = callbackMock.callback;
        systemUnderTest.LoadEntityListPage('TestEntity', null, 0, callbackMock.callback);
        var repositoryMockMethod:any = entityRepositoryServiceMock.LoadPagedFilteredResults;
        var dataLoadedMessagePublishMockMethod:any = messagingServiceMock.Messages.Cache.EntityList.DataLoaded.publish;
        repositoryMockMethod.calls.reset();
        dataLoadedMessagePublishMockMethod.calls.reset();

        //Act
        systemUnderTest.LoadEntityListPage('TestEntity', null, 1, callbackMockMethod);

        //Assert
        expect(callbackMockMethod.calls.any()).toEqual(true);
        expect(repositoryMockMethod.calls.first().args[0]).toEqual('TestEntity');
        expect(repositoryMockMethod.calls.first().args[1]).toEqual(null);
        expect(repositoryMockMethod.calls.first().args[2]).toEqual(1);
        expect(repositoryMockMethod.calls.first().args[3]).toBeGreaterThan(0);
        expect(dataLoadedMessagePublishMockMethod.calls.any()).toEqual(true);
    });

    it('should add newly created entity on top of cache list', function ():void {
        //Arrange
        var callbackMockMethod:any = callbackMock.callback;
        systemUnderTest.LoadEntityListPage('TestEntity', null, 0, callbackMockMethod);
        var repositoryMockMethod:any = entityRepositoryServiceMock.LoadPagedFilteredResults;
        var dataLoadedMessagePublishMockMethod:any = messagingServiceMock.Messages.Cache.EntityList.DataLoaded.publish;
        var dataChangedMessagePublishMockMethod:any = messagingServiceMock.Messages.Cache.EntityList.Changed.publish;
        repositoryMockMethod.calls.reset();
        dataLoadedMessagePublishMockMethod.calls.reset();

        var entityCreatedMessageMock:any = messagingServiceMock.Messages.Entity.Created.subscribe;
        var entityCreatedCallback:(e:Models.Entity) => void = entityCreatedMessageMock.calls.first().args[0];
        var createdEntity:Models.Entity = new Models.Entity('TestEntity');
        createdEntity.Id = 123456;

        //Act
        entityCreatedCallback(createdEntity);
        systemUnderTest.LoadEntityListPage('TestEntity', null, 0, callbackMock.callback);

        //Assert
        expect(callbackMockMethod.calls.any()).toEqual(true);
        expect(callbackMockMethod.calls.first().args[0][0]).toBe(createdEntity);
        expect(repositoryMockMethod.calls.any()).toEqual(false);
        expect(dataLoadedMessagePublishMockMethod.calls.any()).toEqual(false);
        expect(dataChangedMessagePublishMockMethod.calls.any()).toEqual(true);
    });

    it('should remove deleted entity from list', function ():void {
        //Arrange
        var callbackMockMethod:any = callbackMock.callback;
        systemUnderTest.LoadEntityListPage('TestEntity', null, 0, callbackMockMethod);
        var repositoryMockMethod:any = entityRepositoryServiceMock.LoadPagedFilteredResults;
        var dataLoadedMessagePublishMockMethod:any = messagingServiceMock.Messages.Cache.EntityList.DataLoaded.publish;
        var dataChangedMessagePublishMockMethod:any = messagingServiceMock.Messages.Cache.EntityList.Changed.publish;
        repositoryMockMethod.calls.reset();
        dataLoadedMessagePublishMockMethod.calls.reset();
        entityRepositoryServiceMock.AddResponse('LoadPagedFilteredResults', null, null); //2nd call will not respond immediately

        var entityDeletedMessageMock:any = messagingServiceMock.Messages.Entity.Deleted.subscribe;
        var entityDeletedCallback:(d:Models.Entity) => void = entityDeletedMessageMock.calls.first().args[0];
        var deletedEntity:Models.Entity = new Models.Entity('TestEntity');
        deletedEntity.Id = 1;

        //Act
        entityDeletedCallback(deletedEntity);
        systemUnderTest.LoadEntityListPage('TestEntity', null, 0, callbackMockMethod);

        //Assert
        expect(callbackMockMethod.calls.any()).toEqual(true);
        expect(callbackMockMethod.calls.first().args[0][0].Id).toEqual(2);
        expect(repositoryMockMethod.calls.any()).toEqual(true);
        expect(dataChangedMessagePublishMockMethod.calls.any()).toEqual(true);
    });
});
