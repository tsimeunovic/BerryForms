/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/scopeMock.ts" />
/// <reference path="../../../mocks/messagingServiceMock.ts" />
/// <reference path="../../../mocks/notificationServiceMock.ts" />
/// <reference path="../../../mocks/queueServiceMock.ts" />
/// <reference path="../../../mocks/stateServiceMock.ts" />
/// <reference path="../../../mocks/localizationServiceMock.ts" />
/// <reference path="../../../mocks/dashboardRepositoryServiceMock.ts" />
/// <reference path="../../../../../client/angular/controllers/dashboard/dashboardActivityListController.ts" />

'use strict';

describe('Controller: DashboardActivityListController', function ():void {
    var scopeMock:any;
    var routeParams:any;
    var messagingServiceMock:Mocks.MessagingServiceMock;
    var notificationServiceMock:Mocks.NotificationServiceMock;
    var queueServiceMock:Mocks.QueueServiceMock;
    var stateServiceMock:Mocks.StateServiceMock;
    var localizationServiceMock:Mocks.LocalizationServiceMock;
    var dashboardRepositoryServiceMock:Mocks.DashboardRepositoryServiceMock;
    var systemUnderTest:Controllers.DashboardActivityListController;

    //Helper methods
    var createDashboardActivityListController:() => void = function ():void {
        systemUnderTest = new Controllers.DashboardActivityListController(
            scopeMock,
            routeParams,
            messagingServiceMock,
            notificationServiceMock,
            queueServiceMock,
            stateServiceMock,
            localizationServiceMock,
            dashboardRepositoryServiceMock);
    };

    beforeEach(function ():void {
        scopeMock = new Mocks.ScopeMock();
        routeParams = {'_entityName': null};
        messagingServiceMock = new Mocks.MessagingServiceMock();
        notificationServiceMock = new Mocks.NotificationServiceMock();
        queueServiceMock = new Mocks.QueueServiceMock();
        stateServiceMock = new Mocks.StateServiceMock();
        localizationServiceMock = new Mocks.LocalizationServiceMock();
        dashboardRepositoryServiceMock = new Mocks.DashboardRepositoryServiceMock();

        createDashboardActivityListController();
    });

    it('should load recent activity', function ():void {
        //Arrange
        var handleErrorsMock:any = notificationServiceMock.HandleErrorsModel;
        var loadRecentActivitySpy:any = dashboardRepositoryServiceMock.GetRecentActivity;
        var loadingStartedMessageSpy:any = messagingServiceMock.Messages.Loading.Started.publish;
        var loadingFinishedMessageSpy:any = messagingServiceMock.Messages.Loading.Finished.publish;

        //Act
        //Assert
        expect(handleErrorsMock.calls.any()).toEqual(false);
        expect(loadingStartedMessageSpy.calls.any()).toEqual(true);
        expect(loadingStartedMessageSpy.calls.mostRecent().args[0]).toEqual(Static.LoadingType.DashboardActivity);
        expect(loadRecentActivitySpy.calls.any()).toEqual(true);
        expect(loadRecentActivitySpy.calls.first().args[0]).toEqual(null);
        expect(loadingFinishedMessageSpy.calls.any()).toEqual(true);
        expect(loadingFinishedMessageSpy.calls.mostRecent().args[0]).toEqual(Static.LoadingType.DashboardActivity);
    });

    it('should handle client errors from recent activity', function ():void {
        //Arrange
        var handleErrorsMock:any = notificationServiceMock.HandleErrorsModel;
        var returnedError:any = {Type:'Client'};
        dashboardRepositoryServiceMock.AddResponse('GetRecentActivity', null, returnedError);

        //Act
        createDashboardActivityListController();

        //Assert
        expect(handleErrorsMock.calls.any()).toEqual(true);
        expect(handleErrorsMock.calls.first().args[0]).toEqual(returnedError);
    });

    it('should load my recent activity', function ():void {
        //Arrange
        var handleErrorsMock:any = notificationServiceMock.HandleErrorsModel;
        var loadMyRecentActivitySpy:any = dashboardRepositoryServiceMock.GetMyRecentActivity;
        var loadingStartedMessageSpy:any = messagingServiceMock.Messages.Loading.Started.publish;
        var loadingFinishedMessageSpy:any = messagingServiceMock.Messages.Loading.Finished.publish;

        //Act
        //Assert
        expect(handleErrorsMock.calls.any()).toEqual(false);
        expect(loadingStartedMessageSpy.calls.any()).toEqual(true);
        expect(loadingStartedMessageSpy.calls.first().args[0]).toEqual(Static.LoadingType.DashboardMyActivity);
        expect(loadMyRecentActivitySpy.calls.any()).toEqual(true);
        expect(loadMyRecentActivitySpy.calls.first().args[0]).toEqual(null);
        expect(loadingFinishedMessageSpy.calls.any()).toEqual(true);
        expect(loadingFinishedMessageSpy.calls.first().args[0]).toEqual(Static.LoadingType.DashboardMyActivity);
    });

    it('should handle client errors from my recent activity', function ():void {
        //Arrange
        var handleErrorsMock:any = notificationServiceMock.HandleErrorsModel;
        var returnedError:any = {Type:'Client'};
        dashboardRepositoryServiceMock.AddResponse('GetMyRecentActivity', null, returnedError);

        //Act
        createDashboardActivityListController();

        //Assert
        expect(handleErrorsMock.calls.any()).toEqual(true);
        expect(handleErrorsMock.calls.first().args[0]).toEqual(returnedError);
    });

    it('should put both activity lists and translations into scope', function ():void {
        //Arrange
        //Act
        //Assert
        expect(scopeMock.NoRecentActivityMessage).toEqual('#NoRecentActivity');
        expect(scopeMock.ActivityLists.length).toEqual(2);
        expect(scopeMock.ActivityLists[0].Items.length).toBeGreaterThan(0);
        expect(scopeMock.ActivityLists[1].Items.length).toBeGreaterThan(0);
    });
});
