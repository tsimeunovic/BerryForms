/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/localizationServiceMock.ts" />
/// <reference path="../../../mocks/messagingServiceMock.ts" />
/// <reference path="../../../mocks/callbackMock.ts" />
/// <reference path="../../../../../client/angular/services/interaction/dialogService.ts" />

'use strict';

describe('Service: DialogService', function () {
    var systemUnderTest:Services.DialogService;
    var localizationServiceMock:Services.ILocalizationService;
    var messagingServiceMock:Services.IMessagingService;
    var callbackMock:Mocks.CallbackMock;

    beforeEach(function () {
        localizationServiceMock = new Mocks.LocalizationServiceMock();
        messagingServiceMock = new Mocks.MessagingServiceMock();
        callbackMock = new Mocks.CallbackMock();
        systemUnderTest = new Services.DialogService(localizationServiceMock, messagingServiceMock);
    });

    it('should publish \'create dialog\' message when \'CreateConfirmationDialog\' method is called', function () {
        //Arrange
        var dialogText = 'TestDialogText';
        var createDialogPublishSpy:any = messagingServiceMock.Messages.Dialog.Create.publish;

        //Act
        systemUnderTest.CreateConfirmationDialog(dialogText, callbackMock.callback);

        //Assert
        expect(createDialogPublishSpy.calls.any()).toBe(true);
        expect(createDialogPublishSpy.calls.first().args[0].Text).toEqual(dialogText);
        expect(createDialogPublishSpy.calls.first().args[0].Callback).toEqual(callbackMock.callback);
        expect(createDialogPublishSpy.calls.first().args[0].Buttons.length).toEqual(2);
        expect(createDialogPublishSpy.calls.first().args[0].Header).toEqual('#Confirmation');
        expect(createDialogPublishSpy.calls.first().args[0].Buttons[0].Text).toEqual('#Yes');
        expect(createDialogPublishSpy.calls.first().args[0].Buttons[1].Text).toEqual('#No');
    });
});
