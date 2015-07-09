/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/scopeMock.ts" />
/// <reference path="../../../mocks/messagingServiceMock.ts" />
/// <reference path="../../../mocks/notificationServiceMock.ts" />
/// <reference path="../../../mocks/queueServiceMock.ts" />
/// <reference path="../../../mocks/stateServiceMock.ts" />
/// <reference path="../../../mocks/entityMetadataListCacheServiceMock.ts" />
/// <reference path="../../../mocks/entityListCacheServiceMock.ts" />
/// <reference path="../../../mocks/localizationServiceMock.ts" />
/// <reference path="../../../mocks/redirectServiceMock.ts" />
/// <reference path="../../../mocks/filterConverterServiceMock.ts" />
/// <reference path="../../../../../client/angular/controllers/list/entityListWithFilterController.ts" />

'use strict';

describe('Controller: EntityListWithFilterController', function ():void {
    var scopeMock:any;
    var messagingServiceMock:Mocks.MessagingServiceMock;
    var notificationServiceMock:Mocks.NotificationServiceMock;
    var queueServiceMock:Mocks.QueueServiceMock;
    var stateServiceMock:Mocks.StateServiceMock;
    var routeParams:any;
    var entityListCacheServiceMock:Mocks.EntityListCacheServiceMock;
    var entityMetadataListCacheServiceMock:Mocks.EntityMetadataListCacheServiceMock;
    var redirectServiceMock:Mocks.RedirectServiceMock;
    var localizationServiceMock:Mocks.LocalizationServiceMock;
    var filterConverterServiceMock:Mocks.FilterConverterServiceMock;
    var systemUnderTest:Controllers.EntityListWithFilterController;

    //Helper methods
    var createEntityListWithFilterController:() => void = function ():void {
        systemUnderTest = new Controllers.EntityListWithFilterController(
            scopeMock,
            routeParams,
            messagingServiceMock,
            notificationServiceMock,
            queueServiceMock,
            stateServiceMock,
            entityListCacheServiceMock,
            entityMetadataListCacheServiceMock,
            redirectServiceMock,
            localizationServiceMock,
            filterConverterServiceMock);
    };

    beforeEach(function ():void {
        scopeMock = new Mocks.ScopeMock();
        messagingServiceMock = new Mocks.MessagingServiceMock();
        notificationServiceMock = new Mocks.NotificationServiceMock();
        queueServiceMock = new Mocks.QueueServiceMock();
        stateServiceMock = new Mocks.StateServiceMock();
        routeParams = {'_entityName': 'MockEntity', '_pageNumber': 5};
        entityListCacheServiceMock = new Mocks.EntityListCacheServiceMock();
        entityMetadataListCacheServiceMock = new Mocks.EntityMetadataListCacheServiceMock();
        redirectServiceMock = new Mocks.RedirectServiceMock();
        localizationServiceMock = new Mocks.LocalizationServiceMock();
        filterConverterServiceMock = new Mocks.FilterConverterServiceMock();

        createEntityListWithFilterController();
    });

    it('should retrieve metadata and filtered entity list from cache', function ():void {
        //Arrange
        var loadMetadataFromCacheSpy:any = entityMetadataListCacheServiceMock.LoadEntityMetadataFromCache;
        var loadEntityListPageSpy:any = entityListCacheServiceMock.LoadEntityListPage;

        //Act
        //Assert
        expect(loadMetadataFromCacheSpy.calls.any()).toEqual(true);
        expect(loadMetadataFromCacheSpy.calls.first().args[0]).toEqual('MockEntity');
        expect(loadEntityListPageSpy.calls.any()).toEqual(true);
        expect(loadEntityListPageSpy.calls.first().args[0]).toEqual('MockEntity');
        expect(loadEntityListPageSpy.calls.first().args[1]).toEqual({'MockField': 'MockFilterValue'});
        expect(loadEntityListPageSpy.calls.first().args[2]).toEqual(4);
        expect(scopeMock.ListItemMetadata).not.toEqual(null);
        expect(scopeMock.EntityList.length).toEqual(6);
    });

    it('should create filled filter form from query string', function ():void {
        //Arrange
        var createFilterFormMetadataSpy:any = filterConverterServiceMock.CreateFilterFormMetadataFromEntityMetadata;
        var parseFilterQueryStringSpy:any = filterConverterServiceMock.ParseFilterQueryString;
        var createDatabaseQuerySpy:any = filterConverterServiceMock.CreateDatabaseQueryFromFilter;
        var createFilterQueryStringSpy:any = filterConverterServiceMock.CreateFilterQueryString;

        //Act
        //Assert
        expect(createFilterFormMetadataSpy.calls.any()).toEqual(true);
        expect(parseFilterQueryStringSpy.calls.any()).toEqual(true);
        expect(parseFilterQueryStringSpy.calls.first().args[1]).toEqual(routeParams);
        expect(createDatabaseQuerySpy.calls.any()).toEqual(true);
        expect(createFilterQueryStringSpy.calls.any()).toEqual(true);

        expect(scopeMock.Entity.EntitySystemName).toEqual('MockFilterEntity');
        expect(scopeMock.IsFilterEmpty).toEqual(true);
        expect(scopeMock.IsFilterCollapsed).toEqual(true);
        expect(scopeMock.FilterMetadata).not.toEqual(null);
        expect(scopeMock.FilterMetadata.Fields.length).toEqual(4);
        expect(scopeMock.EmptyListMessage).toEqual('#NoRecordsOfFilteredEntity');
        expect(scopeMock.ListHeader).toEqual('#ListOfRecords');
    });

    it('should set paging according to retrieved filtered results', function ():void {
        //Arrange
        var redirectToFilteredPageMock:any = redirectServiceMock.RedirectToFilteredList;

        //Act
        scopeMock.Paging.GoNext();
        scopeMock.Paging.GoFirst();

        //Assert
        expect(scopeMock.Paging.ShowPaging).toEqual(true);
        expect(scopeMock.Paging.CanGoFirst).toEqual(true);
        expect(scopeMock.Paging.CanGoPrevious).toEqual(true);
        expect(scopeMock.Paging.CanGoNext).toEqual(true);
        expect(scopeMock.Paging.CurrentPage).toEqual(5);
        expect(scopeMock.Paging.SelectedPage).toEqual(5);
        expect(scopeMock.Paging.TotalPages).toEqual(10);

        expect(redirectToFilteredPageMock.calls.count()).toEqual(2);
        expect(redirectToFilteredPageMock.calls.first().args[0]).toEqual('MockEntity');
        expect(redirectToFilteredPageMock.calls.first().args[1]).toEqual('mockQueryParam1=mockValue1&mockQueryParam2=mockValue2');
        expect(redirectToFilteredPageMock.calls.first().args[2]).toEqual(6);
    });

    it('should create query string according to current filter value and redirect user when search method is called', function ():void {
        //Arrange
        var createFilterQueryStringSpy:any = filterConverterServiceMock.CreateFilterQueryString;
        var redirectToFilteredPageMock:any = redirectServiceMock.RedirectToFilteredList;

        //Act
        scopeMock.Search();

        //Assert
        expect(createFilterQueryStringSpy.calls.any()).toEqual(true);
        expect(redirectToFilteredPageMock.calls.any()).toEqual(true);
        expect(redirectToFilteredPageMock.calls.first().args[0]).toEqual('MockEntity');
        expect(redirectToFilteredPageMock.calls.first().args[1]).toEqual('mockQueryParam1=mockValue1&mockQueryParam2=mockValue2');
        expect(redirectToFilteredPageMock.calls.first().args[2]).toEqual(1);
    });
});
