/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../../../client/angular/services/repository/httpWrapperService.ts" />

'use strict';

describe('Service: HttpWrapperService', function () {
    var qMock:Mocks.QMock;
    var httpMock:Mocks.HttpMock;
    var stateServiceMock:Mocks.StateServiceMock;
    var systemUnderTest:Services.HttpWrapperService;

    beforeEach(function () {
        qMock = new Mocks.QMock();
        httpMock = new Mocks.HttpMock();
        stateServiceMock = new Mocks.StateServiceMock();

        systemUnderTest = new Services.HttpWrapperService(qMock, httpMock, stateServiceMock);
    });

    it('should resolve returned promise by status of http operation', function () {
        //Arrange
        var returnedModel = {a:1};
        httpMock.AddResponse('get', 'GetUrl', returnedModel, 200);
        var successSpy:any = jasmine.createSpy('success');
        var errorSpy:any = jasmine.createSpy('error');

        //Act
        systemUnderTest.Get('GetUrl', 'GetUrlForTest').then(successSpy, errorSpy);

        //Assert
        expect(successSpy.calls.any()).toEqual(true);
        expect(successSpy.calls.first().args[0]).toBe(returnedModel);
        expect(errorSpy.calls.any()).toEqual(false);
    });

    it('should register for after login retry when server respond with 401 status code', function () {
        //Arrange
        httpMock.AddResponse('post', 'PostUrl', null, 401);
        var successSpy:any = jasmine.createSpy('success');
        var errorSpy:any = jasmine.createSpy('error');
        var registerPostLoginActionSpy:any = stateServiceMock.RegisterPostLoginAction;

        //Act
        systemUnderTest.Post('PostUrl', 'PostUrlForTest', {}, true).then(successSpy, errorSpy);

        //Assert
        expect(registerPostLoginActionSpy.calls.any()).toEqual(true);
        expect(registerPostLoginActionSpy.calls.first().args[0]).toEqual('PostUrlForTest');
        expect(registerPostLoginActionSpy.calls.first().args[1]).toEqual(false);
        expect(successSpy.calls.any()).toEqual(false);
        expect(errorSpy.calls.any()).toEqual(false);
    });

    it('should resolve original predicate when post login action is resolved', function () {
        //Arrange
        var postHttpSpy:any = httpMock.post;
        httpMock.AddResponse('post', 'PostUrl', null, 401);
        var successSpy:any = jasmine.createSpy('success');
        var errorSpy:any = jasmine.createSpy('error');
        var registerPostLoginActionSpy:any = stateServiceMock.RegisterPostLoginAction;
        systemUnderTest.Post('PostUrl', 'PostUrlForTest', {}, false).then(successSpy, errorSpy);
        var postLoginAction = registerPostLoginActionSpy.calls.first().args[2];
        var response2Obj = {a:'b'};
        httpMock.AddResponse('post', 'PostUrl', response2Obj, 200);

        //Act
        postLoginAction();

        //Assert
        expect(postHttpSpy.calls.count()).toEqual(2);
        expect(successSpy.calls.any()).toEqual(true);
        expect(successSpy.calls.first().args[0]).toBe(response2Obj);
        expect(errorSpy.calls.any()).toEqual(false);
    });

    it('should register put post login action as cancellable', function () {
        //Arrange
        var putHttpSpy:any = httpMock.put;
        httpMock.AddResponse('put', 'PutUrl', null, 401);
        var successSpy:any = jasmine.createSpy('success');
        var errorSpy:any = jasmine.createSpy('error');
        var registerPostLoginActionSpy:any = stateServiceMock.RegisterPostLoginAction;

        //Act
        systemUnderTest.Put('PutUrl', 'PutUrlForTest', {}).then(successSpy, errorSpy);

        //Assert
        expect(putHttpSpy.calls.any()).toEqual(true);
        expect(registerPostLoginActionSpy.calls.count()).toEqual(1);
        expect(registerPostLoginActionSpy.calls.first().args[0]).toEqual('PutUrlForTest');
        expect(registerPostLoginActionSpy.calls.first().args[1]).toEqual(true);
        expect(successSpy.calls.any()).toEqual(false);
        expect(errorSpy.calls.any()).toEqual(false);
    });

    it('should register delete post login action as cancellable', function () {
        //Arrange
        var deleteHttpSpy:any = httpMock.delete;
        httpMock.AddResponse('delete', 'DeleteUrl', null, 401);
        var successSpy:any = jasmine.createSpy('success');
        var errorSpy:any = jasmine.createSpy('error');
        var registerPostLoginActionSpy:any = stateServiceMock.RegisterPostLoginAction;

        //Act
        systemUnderTest.Delete('DeleteUrl', 'DeleteUrlForTest').then(successSpy, errorSpy);

        //Assert
        expect(deleteHttpSpy.calls.any()).toEqual(true);
        expect(registerPostLoginActionSpy.calls.count()).toEqual(1);
        expect(registerPostLoginActionSpy.calls.first().args[0]).toEqual('DeleteUrlForTest');
        expect(registerPostLoginActionSpy.calls.first().args[1]).toEqual(true);
        expect(successSpy.calls.any()).toEqual(false);
        expect(errorSpy.calls.any()).toEqual(false);
    });

    it('should include user session data in request headers', function () {
        //Arrange
        var getHttpSpy:any = httpMock.get;

        //Act
        systemUnderTest.Get('GetUrl', 'GetUrlForTest');

        //Assert
        expect(getHttpSpy.calls.any()).toEqual(true);
        expect(getHttpSpy.calls.first().args[1]).not.toEqual(null);
        expect(getHttpSpy.calls.first().args[1].headers['X-BF-Auth-User']).toEqual('MockUser');
        expect(getHttpSpy.calls.first().args[1].headers['X-BF-Auth-Valid-To']).toEqual(1234567890000);
        expect(getHttpSpy.calls.first().args[1].headers['X-BF-Auth-Token']).toEqual('abc-def-ghi');
    });
});