/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/callbackMock.ts" />
/// <reference path="../../../mocks/urlLocatorServiceMock.ts" />
/// <reference path="../../../mocks/httpWrapperServiceMock.ts" />
/// <reference path="../../../mocks/redirectServiceMock.ts" />
/// <reference path="../../../mocks/entityMetadataListCacheServiceMock.ts" />
/// <reference path="../../../../../client/angular/services/repository/dashboardRepositoryService.ts" />

'use strict';

describe('Service: DashboardRepositoryService', function ():void {
    var systemUnderTest:Services.DashboardRepositoryService;
    var httpWrapperServiceMock:Mocks.HttpWrapperServiceMock;
    var callbackMock:Mocks.CallbackMock;
    var urlLocatorServiceMock:Services.IUrlLocatorService;
    var redirectServiceMock:Mocks.RedirectServiceMock;
    var entityMetadataListCacheServiceMock:Mocks.EntityMetadataListCacheServiceMock;

    beforeEach(function ():void {
        httpWrapperServiceMock = new Mocks.HttpWrapperServiceMock();
        callbackMock = new Mocks.CallbackMock();
        urlLocatorServiceMock = new Mocks.UrlLocatorServiceMock();
        redirectServiceMock = new Mocks.RedirectServiceMock();
        entityMetadataListCacheServiceMock = new Mocks.EntityMetadataListCacheServiceMock();

        systemUnderTest = new Services.DashboardRepositoryService(httpWrapperServiceMock,
            urlLocatorServiceMock, redirectServiceMock, entityMetadataListCacheServiceMock);
    });

    it('should resolve url and request data from server when \'GetActivitySummary\' is called', function ():void {
        //Arrange
        var callback:any = callbackMock.callback;
        var returnedSummary:any = {};
        httpWrapperServiceMock.AddResponse('get', 'DashboardActivitySummary/entityName', returnedSummary, 200);

        //Act
        systemUnderTest.GetActivitySummary('entityName', callbackMock.callback);

        //Assert
        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0]).toEqual(returnedSummary);
    });

    it('should call callback with error when \'GetActivitySummary\' response fails', function ():void {
        //Arrange
        var callback:any = callbackMock.callback;
        var errorData:any[] = [];
        httpWrapperServiceMock.AddResponse('get', 'DashboardActivitySummary/entityName', errorData, 400);

        //Act
        systemUnderTest.GetActivitySummary('entityName', callbackMock.callback);

        //Assert
        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0]).toEqual(null);
        expect(callback.calls.first().args[1]).toEqual(errorData);
    });

    it('should resolve url and request data from server when \'GetMyRecentActivity\' is called', function ():void {
        //Arrange
        var callback:any = callbackMock.callback;
        var returnedActivity:any[] = [];
        httpWrapperServiceMock.AddResponse('get', 'MyRecentActivity/entityName', returnedActivity, 200);

        //Act
        systemUnderTest.GetMyRecentActivity('entityName', callbackMock.callback);

        //Assert
        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0]).toEqual(returnedActivity);
    });

    it('should call callback with error when \'GetMyRecentActivity\' response fails', function ():void {
        //Arrange
        var callback:any = callbackMock.callback;
        var errorData:any = {};
        httpWrapperServiceMock.AddResponse('get', 'MyRecentActivity/entityName', errorData, 400);

        //Act
        systemUnderTest.GetMyRecentActivity('entityName', callbackMock.callback);

        //Assert
        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0]).toEqual(null);
        expect(callback.calls.first().args[1]).toEqual(errorData);
    });

    it('should resolve url and request data from server when \'RecentActivity\' is called', function ():void {
        //Arrange
        var callback:any = callbackMock.callback;
        var returnedActivity:any[] = [];
        httpWrapperServiceMock.AddResponse('get', 'RecentActivity/entityName', returnedActivity, 200);

        //Act
        systemUnderTest.GetRecentActivity('entityName', callbackMock.callback);

        //Assert
        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0]).toEqual(returnedActivity);
    });

    it('should call callback with error when \'RecentActivity\' response fails', function ():void {
        //Arrange
        var callback:any = callbackMock.callback;
        var errorData:any = {};
        httpWrapperServiceMock.AddResponse('get', 'RecentActivity/entityName', errorData, 400);

        //Act
        systemUnderTest.GetRecentActivity('entityName', callbackMock.callback);

        //Assert
        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0]).toEqual(null);
        expect(callback.calls.first().args[1]).toEqual(errorData);
    });

    it('should extend activity model when data are retrieved', function ():void {
        //Arrange
        var callback:any = callbackMock.callback;
        var returnedActivity:any[] = [
            {Collection: 'first', Id: 9},
            {Collection: 'first', Id: 9}
        ];
        httpWrapperServiceMock.AddResponse('get', 'RecentActivity/entityName', returnedActivity, 200);

        //Act
        systemUnderTest.GetRecentActivity('entityName', callbackMock.callback);

        //Assert
        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0]).toEqual(returnedActivity);
        expect(returnedActivity[0].EntityName).toEqual('first');
        expect(returnedActivity[0].Url).toEqual('mockEditEntityUrl/first/9');
    });
});
