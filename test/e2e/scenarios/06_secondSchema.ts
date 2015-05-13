/// <reference path="../../jasmine.d.ts" />
/// <reference path="../page-objects/form.ts" />
/// <reference path="../page-objects/entityList.ts" />
/// <reference path="../page-objects/toaster.ts" />
/// <reference path="../page-objects/leftMenu.ts" />
/// <reference path="../page-objects/homePage.ts" />
/// <reference path="../page-objects/confirmDialog.ts" />
/// <reference path="../page-objects/entitySchemaForm.ts" />
/// <reference path="../page-objects/entityRecordForm.ts" />

'use strict';

describe('Feature: 2nd schema', function () {
    beforeEach(function () {
        PageObjects.HomePage.NavigateToWithLogin();
    });

    it('should notify user when is successfully created', function () {
        //Arrange
        var form = PageObjects.Form.Current();
        var successToaster = PageObjects.Toaster.Current('success');
        var leftMenu = PageObjects.LeftMenu.Current();

        //Act
        PageObjects.EntitySchemaForm.NavigateToCreateWithLogin();
        form.FillAndSubmit([
            {Name: 'EntityName', Type: 'text', Value: 'Second entity'},
            {Name: 'EntityDescription', Type: 'text', Value: 'Second entity description'},
            {Name: 'IconColorHex', Type: 'select', Value: '__color__#C8D3FA'},
            {Name: 'IconClassName', Type: 'select', Value: '__icon__music'}
        ]);

        //Assert
        //TODO: Find out how to check toaster
        //expect(successToaster.GetMessage(true)).toEqual('New entity type has been successfully created');
        expect(leftMenu.GetEntityIcons().count()).toEqual(2);
    });

    it('should create clickable entity icon element', function () {
        //Arrange
        var leftMenu = PageObjects.LeftMenu.Current();

        //Act
        leftMenu.ClickIconNamed('Second entity');

        //Assert
        expect(PageObjects.Browser.CurrentUrl()).toMatch(PageObjects.EntityRecordForm.UrlForEntityCreate('second_entity'));
    });

    it('should be able to add new text field', function () {
        //Arrange
        PageObjects.EntitySchemaForm.NavigateToEditWithLogin('second_entity');
        var fieldsList = PageObjects.EntityList.Current();
        var form = PageObjects.Form.Current();
        var nameText = [
            {Name: 'FieldName', Type: 'text', Value: 'Only field'},
            {Name: 'FieldDescription', Type: 'text', Value: 'Description of only text field'},
            {Name: 'FieldTypeName', Type: 'select', Value: 'Text'},
            {Name: 'Required', Type: 'boolean', Value: 'No'},
            {Name: 'DisplayInListName', Type: 'boolean', Value: 'Yes'}
        ];

        //Act
        form.FillAndSubmit(nameText);

        //Assert
        expect(fieldsList.GetListItems().count()).toEqual(1);
    });

    it('should be able to create 2 new entity records', function () {
        //Arrange
        PageObjects.EntityRecordForm.NavigateToCreateWithLogin('second_entity');
        var form = PageObjects.Form.Current();
        var list = PageObjects.EntityList.Current();

        //Act
        form.FillAndSubmit([{Name: 'onlyfield', Type: 'text', Value: 'First record'}]);
        form.FillAndSubmit([{Name: 'onlyfield', Type: 'text', Value: 'Second record'}]);

        //Assert
        expect(list.GetListItems().count()).toEqual(2);
    });

    it('should be able to edit existing record', function () {
        //Arrange
        PageObjects.EntityRecordForm.NavigateToCreateWithLogin('second_entity');
        var form = PageObjects.Form.Current();
        var list = PageObjects.EntityList.Current();

        //Act
        list.EditItem(2);
        form.FillAndSubmit([{Name: 'onlyfield', Type: 'text', Value: 'Updated first record'}]);

        //Assert
        expect(list.GetListItems().count()).toEqual(2);
        expect(list.GetNthItem(1).text()).toMatch('Updated first record');
    });

    it('should be able to delete existing record', function () {
        //Arrange
        PageObjects.EntityRecordForm.NavigateToCreateWithLogin('second_entity');
        var list = PageObjects.EntityList.Current();
        var confirmDialog = PageObjects.ConfirmDialog.Current();

        //Act
        list.DeleteItem(2);
        confirmDialog.Confirm();

        //Assert
        expect(list.GetListItems().count()).toEqual(1);
    });
});
