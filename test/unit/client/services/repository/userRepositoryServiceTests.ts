/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/callbackMock.ts" />
/// <reference path="../../../mocks/urlLocatorServiceMock.ts" />
/// <reference path="../../../mocks/httpWrapperServiceMock.ts" />
/// <reference path="../../../../../client/angular/services/repository/userRepositoryService.ts" />

'use strict';

describe('Service: UserRepositoryService', function ():void {
    var systemUnderTest:Services.UserRepositoryService;
    var httpWrapperServiceMock:Mocks.HttpWrapperServiceMock;
    var urlLocatorServiceMock:Services.IUrlLocatorService;
    var callbackMock:Mocks.CallbackMock;

    beforeEach(function ():void {
        httpWrapperServiceMock = new Mocks.HttpWrapperServiceMock();
        callbackMock = new Mocks.CallbackMock();
        urlLocatorServiceMock = new Mocks.UrlLocatorServiceMock();

        systemUnderTest = new Services.UserRepositoryService(httpWrapperServiceMock, urlLocatorServiceMock);
    });

    it('should create correct model and post it to api when \'LoginUser\' method is called', function ():void {
        //Arrange
        var callback:any = callbackMock.callback;
        var postDataMock:any = httpWrapperServiceMock.AnonymousPost;
        var userSessionData:any = {};
        httpWrapperServiceMock.AddResponse('post', 'Login', userSessionData, 200);

        //Act
        systemUnderTest.LoginUser('UserName', 'UserPassword', true, callback);

        //Assert
        expect(postDataMock.calls.any()).toEqual(true);
        expect(postDataMock.calls.first().args[0]).toEqual('Login');
        expect(postDataMock.calls.first().args[1]).toEqual('Login');
        expect(postDataMock.calls.first().args[2]).toEqual({
            userName: 'UserName',
            password: 'UserPassword',
            stayLoggedIn: true
        });

        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0]).toEqual(userSessionData);
        expect(callback.calls.first().args[1]).toBe(null);
    });

    it('should pass error model to caller when login fails', function ():void {
        //Arrange
        var callback:any = callbackMock.callback;
        var errorModel:any = {};
        httpWrapperServiceMock.AddResponse('post', 'Login', errorModel, 500);

        //Act
        systemUnderTest.LoginUser('UserName', 'UserPassword', true, callback);

        //Assert
        expect(callback.calls.any()).toEqual(true);
        expect(callback.calls.first().args[0]).toEqual(null);
        expect(callback.calls.first().args[1]).toBe(errorModel);
    });
});
