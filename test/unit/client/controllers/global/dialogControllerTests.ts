/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/scopeMock.ts" />
/// <reference path="../../../mocks/messagingServiceMock.ts" />
/// <reference path="../../../../../client/angular/controllers/global/dialogController.ts" />

'use strict';

describe('Controller: DialogController', function () {
    var scopeMock:any;
    var messagingServiceMock:Mocks.MessagingServiceMock;
    var systemUnderTest:Controllers.DialogController;

    beforeEach(function () {
        scopeMock = new Mocks.ScopeMock();
        messagingServiceMock = new Mocks.MessagingServiceMock();
        createDialogController();
    });

    //Helper methods
    var createDialogController = function () {
        systemUnderTest = new Controllers.DialogController(
            scopeMock,
            messagingServiceMock);
    };

    it('should subscribe to create and remove dialog messages', function () {
        //Arrange
        var createDialogMessageSpy:any = messagingServiceMock.Messages.Dialog.Create.subscribe;
        var removeDialogMessageSpy:any = messagingServiceMock.Messages.Dialog.Remove.subscribe;

        //Act
        //Assert
        expect(createDialogMessageSpy.calls.any()).toEqual(true);
        expect(removeDialogMessageSpy.calls.any()).toEqual(true);
    });

    it('should result old dialog object and replace it with new when create dialog method is called', function () {
        //Arrange
        var dialogCallbackCalled:boolean = false;
        var dialogCallbackArgument:any = null;
        scopeMock.Dialog = {
            Header: 'Header',
            Callback: function (argument) {
                dialogCallbackCalled = true;
                dialogCallbackArgument = argument;
            }
        };
        var createDialogMessageSpy:any = messagingServiceMock.Messages.Dialog.Create.subscribe;
        var createDialogCallback:any = createDialogMessageSpy.calls.first().args[0];
        var dialogObject = {Text: 'Test'};

        //Act
        createDialogCallback(dialogObject);

        //Assert
        expect(scopeMock.Dialog).toBe(dialogObject);
        expect(dialogCallbackCalled).toEqual(true);
        expect(dialogCallbackArgument).toEqual(null);
    });
});
