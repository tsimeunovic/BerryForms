/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/scopeMock.ts" />
/// <reference path="../../../mocks/messagingServiceMock.ts" />
/// <reference path="../../../mocks/notificationServiceMock.ts" />
/// <reference path="../../../mocks/queueServiceMock.ts" />
/// <reference path="../../../mocks/stateServiceMock.ts" />
/// <reference path="../../../mocks/entityRepositoryServiceMock.ts" />
/// <reference path="../../../mocks/entityMetadataListCacheServiceMock.ts" />
/// <reference path="../../../mocks/entityListCacheServiceMock.ts" />
/// <reference path="../../../mocks/localizationServiceMock.ts" />
/// <reference path="../../../mocks/redirectServiceMock.ts" />
/// <reference path="../../../mocks/dialogServiceMock.ts" />
/// <reference path="../../../mocks/domManipulationServiceMock.ts" />
/// <reference path="../../../../../client/angular/controllers/list/entityListController.ts" />

'use strict';

describe('Controller: EntityListController', function ():void {
    var scopeMock:any;
    var routeParams:any;
    var messagingServiceMock:Mocks.MessagingServiceMock;
    var notificationServiceMock:Mocks.NotificationServiceMock;
    var queueServiceMock:Mocks.QueueServiceMock;
    var stateServiceMock:Mocks.StateServiceMock;
    var entityMetadataListCacheServiceMock:Mocks.EntityMetadataListCacheServiceMock;
    var localizationServiceMock:Mocks.LocalizationServiceMock;
    var redirectServiceMock:Mocks.RedirectServiceMock;
    var dialogServiceMock:Mocks.DialogServiceMock;
    var domManipulationServiceMock:Mocks.DomManipulationServiceMock;
    var entityListCacheServiceMock:Mocks.EntityListCacheServiceMock;
    var entityRepositoryServiceMock:Mocks.EntityRepositoryServiceMock;
    var systemUnderTest:Controllers.EntityListController;

    //Helper methods
    var createEntityListController:() => void = function ():void {
        systemUnderTest = new Controllers.EntityListController(
            scopeMock,
            routeParams,
            messagingServiceMock,
            notificationServiceMock,
            queueServiceMock,
            stateServiceMock,
            entityMetadataListCacheServiceMock,
            localizationServiceMock,
            redirectServiceMock,
            dialogServiceMock,
            domManipulationServiceMock,
            entityListCacheServiceMock,
            entityRepositoryServiceMock);
    };

    beforeEach(function ():void {
        scopeMock = new Mocks.ScopeMock();
        routeParams = {'_entityName': 'MockEntity', '_entityId': 8, '_pageNumber': 3};
        messagingServiceMock = new Mocks.MessagingServiceMock();
        notificationServiceMock = new Mocks.NotificationServiceMock();
        queueServiceMock = new Mocks.QueueServiceMock();
        stateServiceMock = new Mocks.StateServiceMock();
        entityMetadataListCacheServiceMock = new Mocks.EntityMetadataListCacheServiceMock();
        localizationServiceMock = new Mocks.LocalizationServiceMock();
        redirectServiceMock = new Mocks.RedirectServiceMock();
        dialogServiceMock = new Mocks.DialogServiceMock();
        domManipulationServiceMock = new Mocks.DomManipulationServiceMock();
        entityListCacheServiceMock = new Mocks.EntityListCacheServiceMock();
        entityRepositoryServiceMock = new Mocks.EntityRepositoryServiceMock();

        createEntityListController();
    });

    it('should retrieve metadata and entity list from cache', function ():void {
        //Arrange
        var loadMetadataFromCacheSpy:any = entityMetadataListCacheServiceMock.LoadEntityMetadataFromCache;
        var loadEntityListPageSpy:any = entityListCacheServiceMock.LoadEntityListPage;

        //Act
        //Assert
        expect(loadMetadataFromCacheSpy.calls.any()).toEqual(true);
        expect(loadMetadataFromCacheSpy.calls.first().args[0]).toEqual('MockEntity');
        expect(loadEntityListPageSpy.calls.any()).toEqual(true);
        expect(loadEntityListPageSpy.calls.first().args[0]).toEqual('MockEntity');
        expect(loadEntityListPageSpy.calls.first().args[2]).toEqual(2);
        expect(scopeMock.ListItemMetadata).not.toEqual(null);
        expect(scopeMock.EntityList.length).toEqual(6);
    });

    it('should refresh entity list when cache changes', function ():void {
        //Arrange
        var loadEntityListPageSpy:any = entityListCacheServiceMock.LoadEntityListPage;
        var listCacheInvalidatedMessageSpy:any = messagingServiceMock.Messages.Cache.EntityList.Invalidated.subscribe;
        var listCacheInvalidatedCallback:any = listCacheInvalidatedMessageSpy.calls.first().args[0];
        var listCacheChangedMessageSpy:any = messagingServiceMock.Messages.Cache.EntityList.Changed.subscribe;
        var listCacheChangedCallback:any = listCacheChangedMessageSpy.calls.first().args[0];

        //Act
        listCacheInvalidatedCallback();
        listCacheChangedCallback();

        //Assert
        expect(loadEntityListPageSpy.calls.count()).toEqual(3);
    });

    it('should set page headers and icons', function ():void {
        //Arrange
        //Act
        //Assert
        expect(scopeMock.EmptyListMessage).toEqual('#NoRecordsOfEntity');
        expect(scopeMock.ListHeader).toEqual('#ListOfRecords');
        expect(scopeMock.ListHeaderIcons.length).toEqual(2);
    });

    it('should set paging according to retrieved list results', function ():void {
        //Arrange
        var redirectToPageMock:any = redirectServiceMock.RedirectToEntityPage;

        //Act
        scopeMock.Paging.GoNext();
        scopeMock.Paging.GoFirst();

        //Assert
        expect(scopeMock.Paging.ShowPaging).toEqual(true);
        expect(scopeMock.Paging.CanGoFirst).toEqual(true);
        expect(scopeMock.Paging.CanGoPrevious).toEqual(true);
        expect(scopeMock.Paging.CanGoNext).toEqual(true);
        expect(scopeMock.Paging.CurrentPage).toEqual(3);
        expect(scopeMock.Paging.SelectedPage).toEqual(3);
        expect(scopeMock.Paging.TotalPages).toEqual(10);

        expect(redirectToPageMock.calls.count()).toEqual(2);
        expect(redirectToPageMock.calls.first().args[0]).toEqual('MockEntity');
        expect(redirectToPageMock.calls.first().args[1]).toEqual(8);
        expect(redirectToPageMock.calls.first().args[2]).toEqual(4);
    });

    it('should redirect to create page when create method is called', function ():void {
        //Arrange
        var createIcon:any = scopeMock.ListHeaderIcons[0];
        var redirectToPageMock:any = redirectServiceMock.RedirectToEntityPage;

        //Act
        createIcon.Action();

        //Assert
        expect(redirectToPageMock.calls.any()).toEqual(true);
        expect(redirectToPageMock.calls.first().args[0]).toEqual('MockEntity');
        expect(redirectToPageMock.calls.first().args[1]).toEqual(null);
        expect(redirectToPageMock.calls.first().args[2]).toEqual(3);
    });

    it('should redirect to edit page when edit method is called', function ():void {
        //Arrange
        var scrollToTopSpy:any = domManipulationServiceMock.ScrollToTop;
        var modifyEntityMessageSpy:any = messagingServiceMock.Messages.Entity.Modify.publish;
        var redirectToPageMock:any = redirectServiceMock.RedirectToEntityPage;
        var editEntity:Models.Entity = new Models.Entity('EditEntity');
        editEntity.Id = 12;

        //Act
        scopeMock.ListRecordEdit(editEntity);

        //Assert
        expect(redirectToPageMock.calls.any()).toEqual(true);
        expect(redirectToPageMock.calls.first().args[0]).toEqual('MockEntity');
        expect(redirectToPageMock.calls.first().args[1]).toEqual(12);
        expect(redirectToPageMock.calls.first().args[2]).toEqual(3);
        expect(scrollToTopSpy.calls.any()).toEqual(true);
        expect(modifyEntityMessageSpy.calls.any()).toEqual(true);
        expect(modifyEntityMessageSpy.calls.first().args[0]).toBe(editEntity);
    });

    it('should display confirmation dialog before delete method deletes record', function ():void {
        //Arrange
        var createDialogSpy:any = dialogServiceMock.CreateConfirmationDialog;
        var deleteEntityMessageSpy:any = messagingServiceMock.Messages.Entity.Delete.publish;
        var deleteEntitySpy:any = entityRepositoryServiceMock.DeleteEntity;
        var deleteEntity:Models.Entity = new Models.Entity('DeleteEntity');
        deleteEntity.Id = 15;
        var doNotDeleteEntity:Models.Entity = new Models.Entity('DoNotDeleteEntity');
        doNotDeleteEntity.Id = 22;

        //Act
        scopeMock.ListRecordDelete(deleteEntity);
        dialogServiceMock.CancelNextDialog();
        scopeMock.ListRecordDelete(doNotDeleteEntity);

        //Assert
        expect(createDialogSpy.calls.count()).toEqual(2);
        expect(deleteEntityMessageSpy.calls.count()).toEqual(1);
        expect(deleteEntityMessageSpy.calls.first().args[0]).toBe(deleteEntity);
        expect(deleteEntitySpy.calls.count()).toEqual(1);
        expect(deleteEntitySpy.calls.first().args[0]).toBe(deleteEntity);
    });
});
