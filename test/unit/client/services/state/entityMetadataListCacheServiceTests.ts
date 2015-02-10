/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/callbackMock.ts" />
/// <reference path="../../../mocks/messagingServiceMock.ts" />
/// <reference path="../../../mocks/entityRepositoryServiceMock.ts" />
/// <reference path="../../../mocks/notificationServiceMock.ts" />
/// <reference path="../../../../../client/angular/services/state/entityMetadataListCacheService.ts" />

'use strict';

describe('Service: EntityMetadataListCacheService', function () {
    var systemUnderTest:Services.EntityMetadataListCacheService;
    var callbackMock:Mocks.CallbackMock;
    var messagingServiceMock:Services.IMessagingService;
    var entityRepositoryServiceMock:Mocks.EntityRepositoryServiceMock;
    var notificationServiceMock:Services.INotificationService;

    beforeEach(function () {
        callbackMock = new Mocks.CallbackMock();
        messagingServiceMock = new Mocks.MessagingServiceMock();
        entityRepositoryServiceMock = new Mocks.EntityRepositoryServiceMock();
        notificationServiceMock = new Mocks.NotificationServiceMock();

        systemUnderTest = new Services.EntityMetadataListCacheService(messagingServiceMock, entityRepositoryServiceMock, notificationServiceMock);
    });

    it('should call repository to retrieve all metadata when service is created', function () {
        //Arrange
        var repositoryMockMethod:any = entityRepositoryServiceMock.LoadAllEntityMetadata;
        var dataLoadedMessagePublishMockMethod:any = messagingServiceMock.Messages.Cache.MetadataList.Loaded.publish;

        //Act

        //Assert
        expect(dataLoadedMessagePublishMockMethod.calls.any()).toEqual(true);
        expect(repositoryMockMethod.calls.any()).toEqual(true);
    });

    it('should not call repository when data are already loaded', function () {
        //Arrange
        var repositoryMockMethod:any = entityRepositoryServiceMock.LoadAllEntityMetadata;
        var dataLoadedMessagePublishMockMethod:any = messagingServiceMock.Messages.Cache.MetadataList.Loaded.publish;
        var callbackMockMethod:any = callbackMock.callback;
        repositoryMockMethod.calls.reset();
        dataLoadedMessagePublishMockMethod.calls.reset();

        //Act
        systemUnderTest.LoadEntityMetadataFromCache('Metadata1', callbackMockMethod);

        //Assert
        expect(callbackMockMethod.calls.any()).toEqual(true);
        expect(callbackMockMethod.calls.first().args[0].EntitySystemName).toEqual('Metadata1');
        expect(dataLoadedMessagePublishMockMethod.calls.any()).toEqual(false);
        expect(repositoryMockMethod.calls.any()).toEqual(false);
    });

    it('should modify cache when some of entity metadata is modified', function () {
        //Arrange
        var dataLoadedMessagePublishMockMethod:any = messagingServiceMock.Messages.Cache.MetadataList.Loaded.publish;
        var entityModifiedMessageMock:any = messagingServiceMock.Messages.Metadata.Modified.subscribe;
        var entityChangedCallback = entityModifiedMessageMock.calls.first().args[0];
        var changedEntity = new Models.EntityMetadata();
        changedEntity.EntitySystemName = 'Metadata2';
        dataLoadedMessagePublishMockMethod.calls.reset();

        //Act
        entityChangedCallback(changedEntity);

        //Assert
        expect(systemUnderTest.Data.length).toEqual(4);
        expect(dataLoadedMessagePublishMockMethod.calls.any()).toEqual(true);
    });

    it('should modify cache when new entity metadata is created', function () {
        //Arrange
        var dataLoadedMessagePublishMockMethod:any = messagingServiceMock.Messages.Cache.MetadataList.Loaded.publish;
        var entityCreatedMessageMock:any = messagingServiceMock.Messages.Metadata.Created.subscribe;
        var entityCreatedCallback = entityCreatedMessageMock.calls.first().args[0];
        var createdEntity = new Models.EntityMetadata();
        createdEntity.EntitySystemName = 'MetadataNew';
        dataLoadedMessagePublishMockMethod.calls.reset();

        //Act
        entityCreatedCallback(createdEntity);

        //Assert
        expect(systemUnderTest.Data.length).toEqual(5);
        expect(dataLoadedMessagePublishMockMethod.calls.any()).toEqual(true);
    });
});
