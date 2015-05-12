/// <reference path="../../jasmine.d.ts" />
/// <reference path="../page-objects/dashboard.ts" />
/// <reference path="../page-objects/homePage.ts" />
/// <reference path="../page-objects/loginDialog.ts" />

'use strict';

describe('Feature: Home screen', function () {
    it('should display login window', function () {
        //Arrange
        var loginDialog:PageObjects.LoginDialog = PageObjects.LoginDialog.Current();

        //Act
        PageObjects.HomePage.NavigateTo();

        //Assert
        expect(loginDialog.VisibleDialogsCount()).toEqual(1);
        expect(loginDialog.EnabledSubmitButtonsCount()).toEqual(0);
    });

    it('should display global dashboard after login', function () {
        //Arrange
        var loginDialog:PageObjects.LoginDialog = PageObjects.LoginDialog.Current();

        //Act
        PageObjects.HomePage.NavigateTo();
        loginDialog.LoginAsDefault();

        //Assert
        expect(loginDialog.VisibleDialogsCount()).toEqual(0);
        expect(PageObjects.Browser.CurrentUrl()).toMatch(PageObjects.Dashboard.DashboardUrlPattern);
    });
});
