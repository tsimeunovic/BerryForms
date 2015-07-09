/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/scopeMock.ts" />
/// <reference path="../../../mocks/messagingServiceMock.ts" />
/// <reference path="../../../mocks/entityMetadataListCacheServiceMock.ts" />
/// <reference path="../../../mocks/localizationServiceMock.ts" />
/// <reference path="../../../mocks/notificationServiceMock.ts" />
/// <reference path="../../../../../client/angular/controllers/global/menuController.ts" />

'use strict';

describe('Controller: MenuController', function ():void {
    var scopeMock:any;
    var messagingServiceMock:Mocks.MessagingServiceMock;
    var entityMetadataListCacheServiceMock:Mocks.EntityMetadataListCacheServiceMock;
    var localizationServiceMock:Mocks.LocalizationServiceMock;
    var systemUnderTest:Controllers.MenuController;

    //Helper methods
    var createLoadingController:() => void = function ():void {
        systemUnderTest = new Controllers.MenuController(
            scopeMock,
            messagingServiceMock,
            entityMetadataListCacheServiceMock,
            localizationServiceMock);
    };

    beforeEach(function ():void {
        scopeMock = new Mocks.ScopeMock();
        messagingServiceMock = new Mocks.MessagingServiceMock();
        entityMetadataListCacheServiceMock = new Mocks.EntityMetadataListCacheServiceMock();
        localizationServiceMock = new Mocks.LocalizationServiceMock();
        createLoadingController();
    });

    it('should set header and retrieve current metadata list from cache', function ():void {
        //Arrange
        var metadataCache:Models.EntityMetadata[] = [];
        entityMetadataListCacheServiceMock.SetMetadataCache(metadataCache);

        //Act
        createLoadingController();

        //Assert
        expect(scopeMock.CreateNewEntityTitle).toEqual('#CreateNewEntity');
        expect(scopeMock.Entities).toEqual(metadataCache);
    });

    it('should subscribe to metadata cache changes', function ():void {
        //Arrange
        var metadataCache:Models.EntityMetadata[] = [
            new Models.EntityMetadata(),
            new Models.EntityMetadata(),
            new Models.EntityMetadata()
        ];
        entityMetadataListCacheServiceMock.SetMetadataCache(metadataCache);
        var metadataLoadedMessageSpy:any = messagingServiceMock.Messages.Cache.MetadataList.Loaded.subscribe;
        var metadataLoadedCallback:any = metadataLoadedMessageSpy.calls.first().args[0];

        //Act
        metadataLoadedCallback();

        //Assert
        expect(scopeMock.Entities).toEqual(metadataCache);
    });
});
