/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/localizationServiceMock.ts" />
/// <reference path="../../../mocks/messagingServiceMock.ts" />
/// <reference path="../../../mocks/callbackMock.ts" />
/// <reference path="../../../../../client/angular/services/interaction/notificationService.ts" />

'use strict';

describe('Service: NotificationService', function () {
    var systemUnderTest:Services.NotificationService;
    var localizationServiceMock:Services.ILocalizationService;
    var messagingServiceMock:Services.IMessagingService;
    var callbackMock:Mocks.CallbackMock;

    beforeEach(function () {
        localizationServiceMock = new Mocks.LocalizationServiceMock();
        messagingServiceMock = new Mocks.MessagingServiceMock();
        callbackMock = new Mocks.CallbackMock();
        systemUnderTest = new Services.NotificationService(localizationServiceMock, messagingServiceMock);
    });

    it('should publish \'notification message\' message when \'NotifyMessage\' method is called', function () {
        //Arrange
        var messageText = 'MessageText';
        var notificationMessagePublishSpy:any = messagingServiceMock.Messages.Notification.Message.publish;

        //Act
        systemUnderTest.NotifyMessage(messageText, Services.NotificationSeverity.Information);

        //Assert
        expect(notificationMessagePublishSpy.calls.any()).toBe(true);
        expect(notificationMessagePublishSpy.calls.first().args[0]).toEqual(messageText);
        expect(notificationMessagePublishSpy.calls.first().args[1]).toEqual(Services.NotificationSeverity.Information);
    });

    it('should publish \'notification message\' with resolved message when \'Notify\' method is called', function () {
        //Arrange
        var messageKey = 'MessageKey';
        var notificationMessagePublishSpy:any = messagingServiceMock.Messages.Notification.Message.publish;

        //Act
        systemUnderTest.Notify(messageKey, [], Services.NotificationSeverity.Error);

        //Assert
        expect(notificationMessagePublishSpy.calls.count()).toEqual(1);
        expect(notificationMessagePublishSpy.calls.first().args[0]).toEqual('#' + messageKey);
        expect(notificationMessagePublishSpy.calls.first().args[1]).toEqual(Services.NotificationSeverity.Error);
    });

    it('should be able to handle \'plugin error\' properly', function () {
        //Arrange
        var errorsModel = {Type: 'Plugin', PluginMessage: 'PluginMessage'};
        var notificationMessagePublishSpy:any = messagingServiceMock.Messages.Notification.Message.publish;

        //Act
        systemUnderTest.HandleErrorsModel(errorsModel);

        //Assert
        expect(notificationMessagePublishSpy.calls.count()).toEqual(1);
        expect(notificationMessagePublishSpy.calls.first().args[0]).toEqual(errorsModel.PluginMessage);
        expect(notificationMessagePublishSpy.calls.first().args[1]).toEqual(Services.NotificationSeverity.Warning);
    });

    it('should be able to handle \'client error\' properly', function () {
        //Arrange
        var errorsModel = {Type: 'Client', Errors: [{ErrorTypeKey: 'ErrorTypeKey1'}, {ErrorTypeKey: 'ErrorTypeKey2'}]};
        var notificationMessagePublishSpy:any = messagingServiceMock.Messages.Notification.Message.publish;

        //Act
        systemUnderTest.HandleErrorsModel(errorsModel);

        //Assert
        expect(notificationMessagePublishSpy.calls.count()).toEqual(2);
        expect(notificationMessagePublishSpy.calls.first().args[0]).toEqual('#ErrorTypeKey1');
        expect(notificationMessagePublishSpy.calls.first().args[1]).toEqual(Services.NotificationSeverity.Error);
    });

    it('should be able to handle unknown error type', function () {
        //Arrange
        var errorsModel = {Type: 'NonExistingType'};
        var notificationMessagePublishSpy:any = messagingServiceMock.Messages.Notification.Message.publish;

        //Act
        systemUnderTest.HandleErrorsModel(errorsModel);

        //Assert
        expect(notificationMessagePublishSpy.calls.count()).toEqual(1);
        expect(notificationMessagePublishSpy.calls.first().args[0]).toEqual('#UnknownError');
        expect(notificationMessagePublishSpy.calls.first().args[1]).toEqual(Services.NotificationSeverity.Error);
    });
});
