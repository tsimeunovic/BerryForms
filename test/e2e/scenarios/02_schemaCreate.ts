/// <reference path="../../jasmine.d.ts" />
/// <reference path="../page-objects/form.ts" />
/// <reference path="../page-objects/toaster.ts" />
/// <reference path="../page-objects/leftMenu.ts" />
/// <reference path="../page-objects/homePage.ts" />
/// <reference path="../page-objects/entitySchemaForm.ts" />

'use strict';

describe('Feature: Schema create', function () {
    beforeEach(function () {
        PageObjects.HomePage.NavigateToWithLogin();
    });

    it('should notify user when new schema is successfully created', function () {
        //Arrange
        var form = PageObjects.Form.Current();
        var successToaster = PageObjects.Toaster.Current('success');
        var leftMenu = PageObjects.LeftMenu.Current();

        //Act
        PageObjects.EntitySchemaForm.NavigateToCreateWithLogin();
        form.FillAndSubmit([
            {Name: 'EntityName', Type: 'text', Value: 'First entity'},
            {Name: 'EntityDescription', Type: 'text', Value: 'First entity description'},
            {Name: 'IconColorHex', Type: 'select', Value: '__color__#DAD4BE'},
            {Name: 'IconClassName', Type: 'select', Value: '__icon__pencil'}
        ]);

        //Assert
        //TODO: Find out how to check toaster
        //expect(successToaster.GetMessage(true)).toEqual('New entity type has been successfully created');
        expect(leftMenu.GetEntityIcons().count()).toEqual(1);
    });

    it('should create clickable entity icon element', function () {
        //Arrange
        var leftMenu = PageObjects.LeftMenu.Current();

        //Act
        leftMenu.ClickIconNamed('First entity');

        //Assert
        expect(PageObjects.Browser.CurrentUrl()).toEqual(PageObjects.EntitySchemaForm.UrlForSchemaEdit('first_entity'));
    });
});
