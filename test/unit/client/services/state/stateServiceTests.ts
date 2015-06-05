/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/callbackMock.ts" />
/// <reference path="../../../mocks/messagingServiceMock.ts" />
/// <reference path="../../../mocks/dialogServiceMock.ts" />
/// <reference path="../../../mocks/redirectServiceMock.ts" />
/// <reference path="../../../mocks/localizationServiceMock.ts" />
/// <reference path="../../../mocks/persistentStorageServiceMock.ts" />
/// <reference path="../../../../../client/angular/services/state/stateService.ts" />

'use strict';

describe('Service: EntityListCacheService', function ():void {
    var callbackMock:Mocks.CallbackMock;
    var messagingServiceMock:Mocks.MessagingServiceMock;
    var dialogServiceMock:Mocks.DialogServiceMock;
    var redirectServiceMock:Mocks.RedirectServiceMock;
    var localizationServiceMock:Mocks.LocalizationServiceMock;
    var persistentStorageServiceMock:Mocks.PersistentStorageServiceMock;
    var systemUnderTest:Services.StateService;

    beforeEach(function ():void {
        callbackMock = new Mocks.CallbackMock();
        messagingServiceMock = new Mocks.MessagingServiceMock();
        dialogServiceMock = new Mocks.DialogServiceMock();
        redirectServiceMock = new Mocks.RedirectServiceMock();
        localizationServiceMock = new Mocks.LocalizationServiceMock();
        persistentStorageServiceMock = new Mocks.PersistentStorageServiceMock();

        systemUnderTest = new Services.StateService(messagingServiceMock, dialogServiceMock,
            redirectServiceMock, localizationServiceMock, persistentStorageServiceMock);
    });

    it('should be able to persist edited entity', function ():void {
        //Arrange
        var editedEntity1:Models.Entity = new Models.Entity('EditedEntityName');
        editedEntity1.Id = 10;
        systemUnderTest.SetEditedEntity(editedEntity1);

        //Act
        var editedEntity2:Models.Entity = systemUnderTest.GetEditedEntity('EditedEntityName', 10);

        //Assert
        expect(editedEntity2).toBe(editedEntity1);
    });

    it('should delete edited entity when other entity is requested', function ():void {
        //Arrange
        var editedEntity:Models.Entity = new Models.Entity('EditedEntityName');
        editedEntity.Id = 10;
        systemUnderTest.SetEditedEntity(editedEntity);

        //Act
        var editedEntity1:Models.Entity = systemUnderTest.GetEditedEntity('EditedEntityName', 2);
        var editedEntity2:Models.Entity = systemUnderTest.GetEditedEntity('EditedEntityName', 10);

        //Assert
        expect(editedEntity1).toEqual(null);
        expect(editedEntity2).toEqual(null);
    });

    it('should be able to save current user session', function ():void {
        //Arrange
        var session:Models.UserSession = new Models.UserSession();

        //Act
        systemUnderTest.SetCurrentUserSession(session);
        var retrievedSession:Models.UserSession = systemUnderTest.GetCurrentUserSession();

        //Assert
        expect(retrievedSession).toBe(session);
    });

    it('should execute registered post login actions after valid user session is set', function ():void {
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

    it('should ask user whether to execute pending post login actions that are cancellable after user session is set', function ():void {
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

    it('should get user session from persistent storage when initialized', function ():void {
        //Arrange
        var userSession:Models.UserSession = new Models.UserSession();
        userSession.Token = 'TestToken';
        persistentStorageServiceMock.SaveUserSession(userSession);
        var userLoggedInMessageSpy:any = messagingServiceMock.Messages.User.LoggedIn.publish;

        //Act
        systemUnderTest = new Services.StateService(messagingServiceMock, dialogServiceMock,
            redirectServiceMock, localizationServiceMock, persistentStorageServiceMock);

        //Assert
        expect(userLoggedInMessageSpy.calls.any()).toEqual(true);
        expect(userLoggedInMessageSpy.calls.first().args[0]).toEqual(userSession);
        expect(systemUnderTest.GetCurrentUserSession()).toEqual(userSession);
    });

    it('should save user session to persistent storage if it has \'StayLoggedIn\' flag', function ():void {
        //Arrange
        var userSession:Models.UserSession = new Models.UserSession();
        userSession.Token = 'TestToken';
        userSession.StayLoggedIn = true;
        var persistentSaveSessionSpy:any = persistentStorageServiceMock.SaveUserSession;

        //Act
        systemUnderTest.SetCurrentUserSession(userSession);

        //Assert
        expect(persistentSaveSessionSpy.calls.any()).toEqual(true);
        expect(persistentSaveSessionSpy.calls.first().args[0]).toEqual(userSession);
    });

    it('should remove any old user session from persistent storage if new session is missing \'StayLoggedIn\' flag', function ():void {
        //Arrange
        var oldUserSession:Models.UserSession = new Models.UserSession();
        oldUserSession.Token = 'TestTokenOld';
        oldUserSession.StayLoggedIn = true;

        var userSession:Models.UserSession = new Models.UserSession();
        userSession.Token = 'TestTokenNew';
        userSession.StayLoggedIn = false;

        persistentStorageServiceMock.SaveUserSession(oldUserSession);
        var persistentSaveSessionSpy:any = persistentStorageServiceMock.SaveUserSession;

        //Act
        systemUnderTest.SetCurrentUserSession(userSession);

        //Assert
        expect(persistentSaveSessionSpy.calls.any()).toEqual(true);
        expect(persistentSaveSessionSpy.calls.mostRecent().args[0]).toEqual(null);
    });
});
