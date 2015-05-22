/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/callbackMock.ts" />
/// <reference path="../../../mocks/locationMock.ts" />
/// <reference path="../../../mocks/messagingServiceMock.ts" />
/// <reference path="../../../../../client/angular/services/system/redirectService.ts" />

'use strict';

describe('Service: RedirectService', function ():void {
    var systemUnderTest:Services.RedirectService;
    var locationMock:Mocks.LocationMock;
    var messagingServiceMock:Services.IMessagingService;

    beforeEach(function ():void {
        locationMock = new Mocks.LocationMock();
        messagingServiceMock = new Mocks.MessagingServiceMock();

        systemUnderTest = new Services.RedirectService(locationMock, messagingServiceMock);
    });

    it('should reset all loadings before redirecting to new entity schema', function ():void {
        //Arrange
        var resetLoadingsMessageMock:any = messagingServiceMock.Messages.Loading.Reset.publish;
        var setPathMock:any = locationMock.path;

        //Act
        systemUnderTest.RedirectToCreateEntitySchema();

        //Assert
        expect(resetLoadingsMessageMock.calls.any()).toEqual(true);
        expect(setPathMock.calls.first().args[0]).toEqual('/schema/entity');
    });

    it('should reset all loadings before redirecting to edit of existing entity schema', function ():void {
        //Arrange
        var resetLoadingsMessageMock:any = messagingServiceMock.Messages.Loading.Reset.publish;
        var setPathMock:any = locationMock.path;

        //Act
        systemUnderTest.RedirectToEditEntitySchema('existing');

        //Assert
        expect(resetLoadingsMessageMock.calls.any()).toEqual(true);
        expect(setPathMock.calls.first().args[0]).toEqual('/schema/entity/existing');
    });

    it('should reset all loadings before redirecting to create new entity record', function ():void {
        //Arrange
        var resetLoadingsMessageMock:any = messagingServiceMock.Messages.Loading.Reset.publish;
        var setPathMock:any = locationMock.path;

        //Act
        systemUnderTest.RedirectToCreateEntity('new');

        //Assert
        expect(resetLoadingsMessageMock.calls.any()).toEqual(true);
        expect(setPathMock.calls.first().args[0]).toEqual('/entity/new');
    });

    it('should reset all loadings before redirecting to edit entity record', function ():void {
        //Arrange
        var resetLoadingsMessageMock:any = messagingServiceMock.Messages.Loading.Reset.publish;
        var setPathMock:any = locationMock.path;

        //Act
        systemUnderTest.RedirectToEditEntity('edit', 12);

        //Assert
        expect(resetLoadingsMessageMock.calls.any()).toEqual(true);
        expect(setPathMock.calls.first().args[0]).toEqual('/entity/edit/id/12');
    });

    it('should reset all loadings before redirecting to list of entities', function ():void {
        //Arrange
        var resetLoadingsMessageMock:any = messagingServiceMock.Messages.Loading.Reset.publish;
        var setPathMock:any = locationMock.path;

        //Act
        systemUnderTest.RedirectToEntityPage('edit', 12, 3);

        //Assert
        expect(resetLoadingsMessageMock.calls.any()).toEqual(true);
        expect(setPathMock.calls.first().args[0]).toEqual('/entity/edit/page/3/id/12');
    });

    it('should reset all loadings before redirecting to filtered list of entities', function ():void {
        //Arrange
        var resetLoadingsMessageMock:any = messagingServiceMock.Messages.Loading.Reset.publish;
        var setPathMock:any = locationMock.path;
        var setSearchMock:any = locationMock.search;

        //Act
        systemUnderTest.RedirectToFilteredList('entityname', 'filter=true', 4);

        //Assert
        expect(resetLoadingsMessageMock.calls.any()).toEqual(true);
        expect(setPathMock.calls.first().args[0]).toEqual('/entity/entityname/filteredlist/page/4');
        expect(setSearchMock.calls.first().args[0]).toEqual('filter=true');
    });
});
