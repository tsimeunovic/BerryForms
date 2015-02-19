/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/callbackMock.ts" />
/// <reference path="../../../../../client/angular/services/state/stateService.ts" />

'use strict';

describe('Service: EntityListCacheService', function () {
    var callbackMock:Mocks.CallbackMock;
    var messagingServiceMock:Mocks.MessagingServiceMock;
    var dialogServiceMock:Mocks.DialogServiceMock;
    var redirectServiceMock:Mocks.RedirectServiceMock;
    var localizationServiceMock:Mocks.LocalizationServiceMock;
    var systemUnderTest:Services.StateService;

    beforeEach(function () {
        callbackMock = new Mocks.CallbackMock();
        messagingServiceMock = new Mocks.MessagingServiceMock();
        dialogServiceMock = new Mocks.DialogServiceMock();
        redirectServiceMock = new Mocks.RedirectServiceMock();
        localizationServiceMock = new Mocks.LocalizationServiceMock();

        systemUnderTest = new Services.StateService(messagingServiceMock, dialogServiceMock, redirectServiceMock, localizationServiceMock);
    });

    it('should be able to persist edited entity', function(){
        //Arrange
        var editedEntity = new Models.Entity('EditedEntityName');
        editedEntity.Id = 10;
        systemUnderTest.SetEditedEntity(editedEntity);

        //Act
        var editedEntity = systemUnderTest.GetEditedEntity('EditedEntityName', 10);

        //Assert
        expect(editedEntity).toBe(editedEntity);
    });

    it('should delete edited entity when other entity is requested', function(){
        //Arrange
        var editedEntity = new Models.Entity('EditedEntityName');
        editedEntity.Id = 10;
        systemUnderTest.SetEditedEntity(editedEntity);

        //Act
        var editedEntity1 = systemUnderTest.GetEditedEntity('EditedEntityName', 2);
        var editedEntity2 = systemUnderTest.GetEditedEntity('EditedEntityName', 10);

        //Assert
        expect(editedEntity1).toEqual(null);
        expect(editedEntity2).toEqual(null);
    });

    it('should be able to save current user session', function () {
        //Arrange
        var session:Models.UserSession = new Models.UserSession();

        //Act
        systemUnderTest.SetCurrentUserSession(session);
        var retrievedSession:Models.UserSession = systemUnderTest.GetCurrentUserSession();

        //Assert
        expect(retrievedSession).toBe(session);
    });

    it('should execute registered post login actions after valid user session is set', function () {
        //Arrange
        var action1Spy:any = jasmine.createSpy('action1');
        var action2Spy:any = jasmine.createSpy('action2');
        systemUnderTest.RegisterPostLoginAction('Action1', false, action1Spy, null);
        systemUnderTest.RegisterPostLoginAction('Action2', false, action2Spy, null);
        var showDialogSpy:any = dialogServiceMock.CreateConfirmationDialog;

        //Act
        systemUnderTest.SetCurrentUserSession(new Models.UserSession());

        //Assert
        expect(showDialogSpy.calls.any()).toEqual(false);
        expect(action1Spy.calls.any()).toEqual(true);
        expect(action2Spy.calls.any()).toEqual(true);
    });

    it('should ask user whether to execute pending post login actions that are cancellable after user session is set', function () {
        //Arrange
        var action1Spy:any = jasmine.createSpy('action1');
        var action2Spy:any = jasmine.createSpy('action2');
        var action3Spy:any = jasmine.createSpy('action3');
        systemUnderTest.RegisterPostLoginAction('Action1', false, action1Spy, null);
        systemUnderTest.RegisterPostLoginAction('Action2', true, action2Spy, null);
        systemUnderTest.RegisterPostLoginAction('Action3', true, action3Spy, null);
        var showDialogSpy:any = dialogServiceMock.CreateConfirmationDialog;

        //Act
        systemUnderTest.SetCurrentUserSession(new Models.UserSession());

        //Assert
        expect(showDialogSpy.calls.any()).toEqual(true);
        expect(showDialogSpy.calls.first().args[0]).toEqual(['#RetryActionsQuestion', '#Action2', '#Action3']);
        expect(action1Spy.calls.any()).toEqual(true);
        expect(action2Spy.calls.any()).toEqual(true);
        expect(action3Spy.calls.any()).toEqual(true);
    });
});
