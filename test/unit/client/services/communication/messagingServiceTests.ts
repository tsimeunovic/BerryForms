/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/scopeMock.ts" />
/// <reference path="../../../mocks/callbackMock.ts" />
/// <reference path="../../../../../client/angular/services/communication/messagingService.ts" />

'use strict';

describe('Service: MessagingService', function () {
    var systemUnderTest:Services.MessagingService;
    var rootScopeMock:Mocks.RootScopeMock;
    var callbackMock:any;

    beforeEach(function () {
        rootScopeMock = new Mocks.RootScopeMock();
        systemUnderTest = new Services.MessagingService(rootScopeMock);
        callbackMock = new Mocks.CallbackMock();
    });

    it('should notify \'entity created\' subscribers without root scope apply', function(){
        //Arrange
        systemUnderTest.Messages.Entity.Created.subscribe(callbackMock.callback);
        var entityData:any = { name: 'test' };
        var entityData2:any = { name: 'test2' };
        var rootScopeSpy:any = rootScopeMock.$apply;

        //Act
        systemUnderTest.Messages.Entity.Created.publish(entityData);
        systemUnderTest.Messages.Entity.Created.publish(entityData2);

        //Assert
        expect(callbackMock.callback.calls.first().args[0]).toEqual(entityData);
        expect(callbackMock.callback.calls.count()).toEqual(2);
        expect(rootScopeSpy.calls.any()).toBe(false);
    });

    it('should be able to unsubscribe \'metadata created\' after first call', function(){
        //Arrange
        var subscription = systemUnderTest.Messages.Metadata.Created.subscribe(callbackMock.callback);
        var entityData:any = { name: 'test' };
        var entityData2:any = { name: 'test2' };

        //Act
        systemUnderTest.Messages.Metadata.Created.publish(entityData);
        subscription();
        systemUnderTest.Messages.Metadata.Created.publish(entityData2);

        //Assert
        expect(callbackMock.callback.calls.first().args[0]).toEqual(entityData);
        expect(callbackMock.callback.calls.count()).toEqual(1);
    });
});
