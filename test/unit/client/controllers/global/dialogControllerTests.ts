/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/scopeMock.ts" />
/// <reference path="../../../mocks/messagingServiceMock.ts" />
/// <reference path="../../../../../client/angular/controllers/global/dialogController.ts" />

'use strict';

describe('Controller: DialogController', function ():void {
    var scopeMock:any;
    var messagingServiceMock:Mocks.MessagingServiceMock;
    var systemUnderTest:Controllers.DialogController;

    //Helper methods
    var createDialogController:() => void = function ():void {
        systemUnderTest = new Controllers.DialogController(
            scopeMock,
            messagingServiceMock);
    };

    beforeEach(function ():void {
        scopeMock = new Mocks.ScopeMock();
        messagingServiceMock = new Mocks.MessagingServiceMock();
        createDialogController();
    });

    it('should subscribe to create and remove dialog messages', function ():void {
        //Arrange
        var createDialogMessageSpy:any = messagingServiceMock.Messages.Dialog.Create.subscribe;
        var removeDialogMessageSpy:any = messagingServiceMock.Messages.Dialog.Remove.subscribe;

        //Act
        //Assert
        expect(createDialogMessageSpy.calls.any()).toEqual(true);
        expect(removeDialogMessageSpy.calls.any()).toEqual(true);
    });

    it('should result old dialog object and replace it with new when create dialog method is called', function ():void {
        //Arrange
        var dialogCallbackCalled:boolean = false;
        var dialogCallbackArgument:any = null;
        scopeMock.Dialog = {
            Header: 'Header',
            Callback: function (argument:any):void {
                dialogCallbackCalled = true;
                dialogCallbackArgument = argument;
            }
        };
        var createDialogMessageSpy:any = messagingServiceMock.Messages.Dialog.Create.subscribe;
        var createDialogCallback:any = createDialogMessageSpy.calls.first().args[0];
        var dialogObject:any = {Text: 'Test'};

        //Act
        createDialogCallback(dialogObject);

        //Assert
        expect(scopeMock.Dialog).toBe(dialogObject);
        expect(dialogCallbackCalled).toEqual(true);
        expect(dialogCallbackArgument).toEqual(null);
    });
});
