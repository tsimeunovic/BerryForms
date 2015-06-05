/// <reference path="../../jasmine.d.ts" />
/// <reference path="../page-objects/homePage.ts" />
/// <reference path="../page-objects/loginDialog.ts" />

'use strict';

describe('Feature: Login dialog', function ():void {
    it('should provide option to keep user logged in', function ():void {
        //Arrange
        var loginDialog:PageObjects.LoginDialog = PageObjects.LoginDialog.Current();

        //Act
        PageObjects.HomePage.NavigateTo();
        loginDialog.LoginAsDefault(true);

        //Assert
        expect(loginDialog.VisibleDialogsCount()).toEqual(0);
    });

    it('should not display login dialog again after reload when user decided to stay logged in', function ():void {
        //Arrange
        var loginDialog:PageObjects.LoginDialog = PageObjects.LoginDialog.Current();

        //Act
        PageObjects.HomePage.NavigateTo();

        //Assert
        expect(loginDialog.VisibleDialogsCount()).toEqual(0);
    });
});
