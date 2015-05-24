/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/scopeMock.ts" />
/// <reference path="../../../mocks/messagingServiceMock.ts" />
/// <reference path="../../../mocks/localizationServiceMock.ts" />
/// <reference path="../../../../../client/angular/controllers/global/notificationController.ts" />
/// <reference path="../../../../../client/angular/interfaces/services/interaction/INotificationService.ts" />

'use strict';

describe('Controller: NotificationController', function ():void {
    var scopeMock:any;
    var messagingServiceMock:Mocks.MessagingServiceMock;
    var localizationServiceMock:Mocks.LocalizationServiceMock;
    var toasterConfigMock:any;
    var toasterMock:any;
    var systemUnderTest:Controllers.NotificationController;

    //Helper methods
    var createNotificationController:() => void = function ():void {
        systemUnderTest = new Controllers.NotificationController(
            scopeMock,
            toasterMock,
            toasterConfigMock,
            messagingServiceMock,
            localizationServiceMock);
    };

    beforeEach(function ():void {
        scopeMock = new Mocks.ScopeMock();
        messagingServiceMock = new Mocks.MessagingServiceMock();
        localizationServiceMock = new Mocks.LocalizationServiceMock();

        //Inline Toaster mocks
        toasterConfigMock = {};
        toasterMock = {
            pop: function (type:string, title:string, body:string):void {
                //Do nothing
            }
        };
        spyOn(toasterMock, 'pop').and.callThrough();

        createNotificationController();
    });

    var checkMessageType:(s:Static.NotificationSeverity, t:string) => void =
        function (severity:Static.NotificationSeverity, toasterType:string):void {
            //Arrange
            var toasterSpy:any = toasterMock.pop;
            var notificationMessageSpy:any = messagingServiceMock.Messages.Notification.Message.subscribe;
            var notificationCallback:any = notificationMessageSpy.calls.first().args[0];
            var message:any = {
                Severity: severity,
                Message: 'Test message'
            };

            //Act
            notificationCallback(message);

            //Assert
            expect(toasterSpy.calls.any()).toEqual(true);
            expect(toasterSpy.calls.first().args[0]).toEqual(toasterType);
            expect(toasterSpy.calls.first().args[2]).toEqual(message.Message);
        };

    it('should override toaster configurations and subscribe to notification messages', function ():void {
        //Arrange
        var notificationMessageSpy:any = messagingServiceMock.Messages.Notification.Message.subscribe;

        //Act
        //Assert
        expect(notificationMessageSpy.calls.any()).toEqual(true);
        expect(Object.keys(toasterConfigMock).length).toBeGreaterThan(0);
    });

    it('should correctly handle \'error\' message type', function ():void {
        checkMessageType(Static.NotificationSeverity.Error, 'error');
    });

    it('should correctly handle \'warning\' message type', function ():void {
        checkMessageType(Static.NotificationSeverity.Warning, 'warning');
    });

    it('should correctly handle \'info\' message type', function ():void {
        checkMessageType(Static.NotificationSeverity.Information, 'info');
    });

    it('should correctly handle \'success\' message type', function ():void {
        checkMessageType(Static.NotificationSeverity.Success, 'success');
    });
});
