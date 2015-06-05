/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/scopeMock.ts" />
/// <reference path="../../../mocks/messagingServiceMock.ts" />
/// <reference path="../../../mocks/stateServiceMock.ts" />
/// <reference path="../../../mocks/dialogServiceMock.ts" />
/// <reference path="../../../mocks/localizationServiceMock.ts" />
/// <reference path="../../../mocks/userRepositoryServiceMock.ts" />
/// <reference path="../../../mocks/notificationServiceMock.ts" />
/// <reference path="../../../../../client/angular/controllers/login/loginController.ts" />

'use strict';
var _global:any = this;
var OriginalServices:any;

describe('Controller: LoginController', function ():void {
    var scopeMock:any;
    var messagingServiceMock:Mocks.MessagingServiceMock;
    var stateServiceMock:Mocks.StateServiceMock;
    var dialogServiceMock:Mocks.DialogServiceMock;
    var localizationServiceMock:Mocks.LocalizationServiceMock;
    var userRepositoryServiceMock:Mocks.UserRepositoryServiceMock;
    var notificationServiceMock:Mocks.NotificationServiceMock;
    var systemUnderTest:Controllers.LoginController;

    //Helper methods
    var createLoginController:() => void = function ():void {
        systemUnderTest = new Controllers.LoginController(
            scopeMock,
            messagingServiceMock,
            stateServiceMock,
            dialogServiceMock,
            localizationServiceMock,
            userRepositoryServiceMock,
            notificationServiceMock);
    };

    beforeEach(function ():void {
        scopeMock = new Mocks.ScopeMock();
        messagingServiceMock = new Mocks.MessagingServiceMock();
        stateServiceMock = new Mocks.StateServiceMock();
        dialogServiceMock = new Mocks.DialogServiceMock();
        localizationServiceMock = new Mocks.LocalizationServiceMock();
        userRepositoryServiceMock = new Mocks.UserRepositoryServiceMock();
        notificationServiceMock = new Mocks.NotificationServiceMock();

        OriginalServices = _global.Services;
        _global.Services = {LocalizationService: localizationServiceMock};

        createLoginController();
    });

    afterEach(function ():void {
        _global.Services = OriginalServices;
    });

    it('should hide login form when valid user is logged in', function ():void {
        //Arrange
        //Act
        //Assert
        expect(scopeMock.LoggedInUser).toEqual(true);
    });

    it('should initialize scope with header and button text when created', function ():void {
        //Arrange
        stateServiceMock.SetCurrentUserSession(null);
        var loginMessageSpy:any = messagingServiceMock.Messages.User.LoggedIn.subscribe;
        var logoutMessageSpy:any = messagingServiceMock.Messages.User.LoggedOut.subscribe;

        //Act
        createLoginController();

        //Assert
        expect(loginMessageSpy.calls.any()).toEqual(true);
        expect(logoutMessageSpy.calls.any()).toEqual(true);
        expect(scopeMock.LoggedInUser).toEqual(false);
        expect(scopeMock.LoginInProgress).toEqual(false);
        expect(scopeMock.LoginHeader).toEqual('#Login');
        expect(scopeMock.LoginButtonText).toEqual('#Login');
        expect(scopeMock.EntityMetadata).not.toEqual(null);
        expect(scopeMock.EntityMetadata.Fields.length).toEqual(3);
    });

    it('should fill login form user name with last logged in user name', function ():void {
        //Arrange
        var logoutMessageSpy:any = messagingServiceMock.Messages.User.LoggedOut.subscribe;
        var logoutMessageCallback:any = logoutMessageSpy.calls.first().args[0];
        var lastSession:Models.UserSession = new Models.UserSession();
        var lastUser:Models.User = new Models.User();
        lastUser.UserName = 'TestUser';
        lastSession.User = lastUser;
        this.DefaultUserSession = lastSession;

        //Act
        stateServiceMock.SetCurrentUserSession(null);
        logoutMessageCallback(lastSession);

        //Assert
        expect(scopeMock.LoggedInUser).toEqual(false);
        expect(scopeMock.Entity.Data.UserName).toEqual('TestUser');
    });

    it('should reset password field after unsuccessful login', function ():void {
        //Arrange
        var loginUserSpy:any = userRepositoryServiceMock.LoginUser;
        var handleErrorsSpy:any = notificationServiceMock.HandleErrorsModel;
        userRepositoryServiceMock.AddResponse('LoginUser', null, 'InvalidUserNameOrPassword');
        scopeMock.Entity.Data.UserName = 'TestUserName';
        scopeMock.Entity.Data.Password = 'TestPassword';

        //Act
        scopeMock.Login();

        //Assert
        expect(loginUserSpy.calls.any()).toEqual(true);
        expect(loginUserSpy.calls.first().args[0]).toEqual('TestUserName');
        expect(loginUserSpy.calls.first().args[1]).toEqual('TestPassword');
        expect(loginUserSpy.calls.first().args[2]).toEqual(false);
        expect(handleErrorsSpy.calls.any()).toEqual(true);
        expect(handleErrorsSpy.calls.first().args[0]).toEqual('InvalidUserNameOrPassword');
        expect(scopeMock.Entity.Data.Password).toEqual(null);
    });

    it('should set current session after successful login', function ():void {
        //Arrange
        var loadingStartedSpy:any = messagingServiceMock.Messages.Loading.Started.publish;
        var loadingFinishedSpy:any = messagingServiceMock.Messages.Loading.Finished.publish;
        var setCurrentUserSessionSpy:any = stateServiceMock.SetCurrentUserSession;

        //Act
        scopeMock.Login();

        //Assert
        expect(setCurrentUserSessionSpy.calls.any()).toEqual(true);
        expect(setCurrentUserSessionSpy.calls.first().args[0]).not.toEqual(null);
        expect(loadingStartedSpy.calls.any()).toEqual(true);
        expect(loadingFinishedSpy.calls.any()).toEqual(true);
    });

    it('should set \'keep logged in\' flag during login when user selected it', function ():void {
        //Arrange
        var loginUserSpy:any = userRepositoryServiceMock.LoginUser;
        scopeMock.Entity.Data.UserName = 'TestUserName';
        scopeMock.Entity.Data.Password = 'TestPassword';
        scopeMock.Entity.Data.StayLoggedIn = true;

        //Act
        scopeMock.Login();

        //Assert
        expect(loginUserSpy.calls.any()).toEqual(true);
        expect(loginUserSpy.calls.first().args[2]).toEqual(true);
    });
});
