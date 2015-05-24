/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/scopeMock.ts" />
/// <reference path="../../../mocks/messagingServiceMock.ts" />
/// <reference path="../../../mocks/stateServiceMock.ts" />
/// <reference path="../../../../../client/angular/controllers/global/loadingController.ts" />

'use strict';

describe('Controller: LoadingController', function ():void {
    var scopeMock:any;
    var messagingServiceMock:Mocks.MessagingServiceMock;
    var stateServiceMock:Mocks.StateServiceMock;
    var systemUnderTest:Controllers.LoadingController;

    //Helper methods
    var createLoadingController:() => void = function ():void {
        systemUnderTest = new Controllers.LoadingController(
            scopeMock,
            messagingServiceMock,
            stateServiceMock);
    };

    beforeEach(function ():void {
        scopeMock = new Mocks.ScopeMock();
        messagingServiceMock = new Mocks.MessagingServiceMock();
        stateServiceMock = new Mocks.StateServiceMock();
        createLoadingController();
    });

    it('should subscribe to all loading messages', function ():void {
        //Arrange
        var startLoadingMessageSpy:any = messagingServiceMock.Messages.Loading.Started.subscribe;
        var endLoadingMessageSpy:any = messagingServiceMock.Messages.Loading.Finished.subscribe;
        var resetLoadingMessageSpy:any = messagingServiceMock.Messages.Loading.Reset.subscribe;

        //Act
        //Assert
        expect(startLoadingMessageSpy.calls.any()).toEqual(true);
        expect(endLoadingMessageSpy.calls.any()).toEqual(true);
        expect(resetLoadingMessageSpy.calls.any()).toEqual(true);
        expect(scopeMock.LoadingInProgress).toEqual(false);
    });

    it('should display loading when new task is in progress', function ():void {
        //Arrange
        var startLoadingMessageSpy:any = messagingServiceMock.Messages.Loading.Started.subscribe;
        var startLoadingCallback:any = startLoadingMessageSpy.calls.first().args[0];

        //Act
        startLoadingCallback('Task1');

        //Assert
        expect(scopeMock.LoadingInProgress).toEqual(true);
    });

    it('should display loading when there are still some tasks in progress', function ():void {
        //Arrange
        var startLoadingMessageSpy:any = messagingServiceMock.Messages.Loading.Started.subscribe;
        var startLoadingCallback:any = startLoadingMessageSpy.calls.first().args[0];
        var endLoadingMessageSpy:any = messagingServiceMock.Messages.Loading.Finished.subscribe;
        var endLoadingCallback:any = endLoadingMessageSpy.calls.first().args[0];

        //Act
        startLoadingCallback('Task1');
        startLoadingCallback('Task2');
        endLoadingCallback('Task1');

        //Assert
        expect(scopeMock.LoadingInProgress).toEqual(true);
    });

    it('should hide loading when all tasks in progress have finished', function ():void {
        //Arrange
        var startLoadingMessageSpy:any = messagingServiceMock.Messages.Loading.Started.subscribe;
        var startLoadingCallback:any = startLoadingMessageSpy.calls.first().args[0];
        var endLoadingMessageSpy:any = messagingServiceMock.Messages.Loading.Finished.subscribe;
        var endLoadingCallback:any = endLoadingMessageSpy.calls.first().args[0];

        //Act
        startLoadingCallback('Task1');
        startLoadingCallback('Task2');
        endLoadingCallback('Task1');
        endLoadingCallback('Task2');

        //Assert
        expect(scopeMock.LoadingInProgress).toEqual(false);
    });

    it('should hide loading when all loading is reset', function ():void {
        //Arrange
        var startLoadingMessageSpy:any = messagingServiceMock.Messages.Loading.Started.subscribe;
        var startLoadingCallback:any = startLoadingMessageSpy.calls.first().args[0];
        var resetLoadingMessageSpy:any = messagingServiceMock.Messages.Loading.Reset.subscribe;
        var resetLoadingCallback:any = resetLoadingMessageSpy.calls.first().args[0];

        //Act
        startLoadingCallback('Task1');
        startLoadingCallback('Task2');
        resetLoadingCallback();

        //Assert
        expect(scopeMock.LoadingInProgress).toEqual(false);
    });
});
