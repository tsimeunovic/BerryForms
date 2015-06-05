/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../../../client/angular/services/state/persistentStorageService.ts" />

'use strict';

describe('Service: PersistentStorageService', function ():void {
    var systemUnderTest:Services.PersistentStorageService;

    beforeEach(function ():void {
        systemUnderTest = new Services.PersistentStorageService();
    });

    it('should be able to save and load UserSession to and from persistent storage', function ():void {
        //Arrange
        var session:Models.UserSession = new Models.UserSession();
        session.Token = 'TestToken';
        var sessionClone:any = JSON.parse(JSON.stringify(session));

        //Act
        var retrievedSession1:any = systemUnderTest.LoadUserSession();
        systemUnderTest.SaveUserSession(session);
        var retrievedSession2:any = systemUnderTest.LoadUserSession();
        systemUnderTest.SaveUserSession(null);
        var retrievedSession3:any = systemUnderTest.LoadUserSession();

        //Assert
        expect(retrievedSession1).toEqual(null);
        expect(retrievedSession2).toEqual(sessionClone);
        expect(retrievedSession3).toEqual(null);
    });
});
