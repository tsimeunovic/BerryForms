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
        httpMock.AddResponse('get', 'GetUrl', true, returnedModel);
        var successSpy:any = jasmine.createSpy('success');
        var errorSpy:any = jasmine.createSpy('error');

        //Act
        systemUnderTest.Get('GetUrl', 'GetUrlForTest').then(successSpy, errorSpy);

        //Assert
        expect(successSpy.calls.any()).toEqual(true);
        expect(successSpy.calls.first().args[0]).toBe(returnedModel);
        expect(errorSpy.calls.any()).toEqual(false);
    });
});