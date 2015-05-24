/// <reference path="../../jasmine.d.ts" />
/// <reference path="../page-objects/form.ts" />
/// <reference path="../page-objects/toaster.ts" />
/// <reference path="../page-objects/leftMenu.ts" />
/// <reference path="../page-objects/homePage.ts" />
/// <reference path="../page-objects/confirmDialog.ts" />
/// <reference path="../page-objects/entityList.ts" />
/// <reference path="../page-objects/headerIcons.ts" />
/// <reference path="../page-objects/entityRecordForm.ts" />
/// <reference path="../page-objects/entitySchemaForm.ts" />

'use strict';

describe('Feature: Schema edit', function ():void {
    beforeEach(function ():void {
        PageObjects.EntitySchemaForm.NavigateToEditWithLogin('first_entity');
    });

    var fields:any[] = [
        [
            {Name: 'FieldName', Type: 'text', Value: 'Boolean field'},
            {Name: 'FieldDescription', Type: 'text', Value: 'Description of boolean field'},
            {Name: 'FieldTypeName', Type: 'select', Value: 'Boolean'},
            {Name: 'Required', Type: 'boolean', Value: 'Yes'},
            {Name: 'DisplayInListName', Type: 'boolean', Value: 'Yes'},
            {Name: 'ThreeState', Type: 'boolean', Value: 'Yes'}
        ],
        [
            {Name: 'FieldName', Type: 'text', Value: 'Text field'},
            {Name: 'FieldDescription', Type: 'text', Value: 'Description of text field'},
            {Name: 'FieldTypeName', Type: 'select', Value: 'Text'},
            {Name: 'Required', Type: 'boolean', Value: 'Yes'},
            {Name: 'DisplayInListName', Type: 'boolean', Value: 'Yes'},
            {Name: 'MaxLength', Type: 'number', Value: '15'}
        ],
        [
            {Name: 'FieldName', Type: 'text', Value: 'Date field'},
            {Name: 'FieldDescription', Type: 'text', Value: 'Description of date field'},
            {Name: 'FieldTypeName', Type: 'select', Value: 'Date'},
            {Name: 'Required', Type: 'boolean', Value: 'No'},
            {Name: 'DisplayInListName', Type: 'boolean', Value: 'No'},
            {Name: 'MinDate', Type: 'date', Value: '1.1.2015'},
            {Name: 'MaxDate', Type: 'date', Value: '31.12.2015'}
        ],
        [
            {Name: 'FieldName', Type: 'text', Value: 'List field'},
            {Name: 'FieldDescription', Type: 'text', Value: 'Description of list field'},
            {Name: 'FieldTypeName', Type: 'select', Value: 'List'},
            {Name: 'Required', Type: 'boolean', Value: 'No'},
            {Name: 'DisplayInListName', Type: 'boolean', Value: 'No'},
            {Name: 'MaxRecordsCount', Type: 'number', Value: '8'},
            {Name: 'MaxRecordLength', Type: 'number', Value: '15'}
        ],
        [
            {Name: 'FieldName', Type: 'text', Value: 'Select field'},
            {Name: 'FieldDescription', Type: 'text', Value: 'Description of select field'},
            {Name: 'FieldTypeName', Type: 'select', Value: 'Select'},
            {Name: 'Required', Type: 'boolean', Value: 'Yes'},
            {Name: 'DisplayInListName', Type: 'boolean', Value: 'Yes'},
            {Name: 'Values', Type: 'list', Value: ['Banana', 'Apple', 'Pear']},
            {Name: 'DefaultValue', Type: 'text', Value: 'None'}
        ],
        [
            {Name: 'FieldName', Type: 'text', Value: 'Textarea field'},
            {Name: 'FieldDescription', Type: 'text', Value: 'Description of textarea field'},
            {Name: 'FieldTypeName', Type: 'select', Value: 'Textarea'},
            {Name: 'Required', Type: 'boolean', Value: 'No'},
            {Name: 'DisplayInListName', Type: 'boolean', Value: 'Yes'},
            {Name: 'MaxLength', Type: 'number', Value: '30'}
        ],
        [
            {Name: 'FieldName', Type: 'text', Value: 'Relationship field'},
            {Name: 'FieldDescription', Type: 'text', Value: 'Description of relationship field'},
            {Name: 'FieldTypeName', Type: 'select', Value: 'Relation'},
            {Name: 'Required', Type: 'boolean', Value: 'No'},
            {Name: 'DisplayInListName', Type: 'boolean', Value: 'No'},
            {Name: 'RelatedEntity', Type: 'select', Value: 'first_entity'}
        ],
        [
            {Name: 'FieldName', Type: 'text', Value: 'Number field'},
            {Name: 'FieldDescription', Type: 'text', Value: 'Description of number field'},
            {Name: 'FieldTypeName', Type: 'select', Value: 'Number'},
            {Name: 'Required', Type: 'boolean', Value: 'No'},
            {Name: 'DisplayInListName', Type: 'boolean', Value: 'No'},
            {Name: 'AllowFloating', Type: 'boolean', Value: 'No'},
            {Name: 'MinValue', Type: 'number', Value: '10'},
            {Name: 'MaxValue', Type: 'number', Value: '100'}
        ],
        [
            {Name: 'FieldName', Type: 'text', Value: 'Email field'},
            {Name: 'FieldDescription', Type: 'text', Value: 'Description of email field'},
            {Name: 'FieldTypeName', Type: 'select', Value: 'Email'},
            {Name: 'Required', Type: 'boolean', Value: 'No'},
            {Name: 'DisplayInListName', Type: 'boolean', Value: 'No'}
        ]
    ];

    it('should contain no field when entity is newly created', function ():void {
        //Arrange
        var fieldsList:PageObjects.EntityList = PageObjects.EntityList.Current();

        //Act
        //Assert
        expect(fieldsList.GetListItems().count()).toEqual(0);
    });

    it('should have disabled \'Add\' button on form', function ():void {
        //Arrange
        var form:PageObjects.Form = PageObjects.Form.Current();

        //Act
        //Assert
        expect(form.SubmitButton.Disabled()).toBeTruthy();
        expect(form.SubmitButton.Text()).toMatch('Add');
    });

    it('should enable submit when form is properly filled with new \'boolean\' field type', function ():void {
        //Arrange
        var form:PageObjects.Form = PageObjects.Form.Current();

        //Act
        form.Fill(fields[0]);

        //Assert
        expect(form.SubmitButton.Disabled()).toBeFalsy();
    });

    it('should add newly created \'boolean\' and \'text\' fields to the list', function ():void {
        //Arrange
        var form:PageObjects.Form = PageObjects.Form.Current();
        var fieldsList:PageObjects.EntityList = PageObjects.EntityList.Current();

        //Act
        form.FillAndSubmit(fields[0]);
        form.FillAndSubmit(fields[1]);

        //Assert
        expect(fieldsList.GetListItems().count()).toEqual(2);
    });

    it('should not allow to create two fields with same name', function ():void {
        //Arrange
        var form:PageObjects.Form = PageObjects.Form.Current();
        var fieldsList:PageObjects.EntityList = PageObjects.EntityList.Current();
        var conflictingFieldData:any[] = [
            {Name: 'FieldName', Type: 'text', Value: 'Text field'},
            {Name: 'FieldDescription', Type: 'text', Value: 'Description of text field'},
            {Name: 'FieldTypeName', Type: 'select', Value: 'Text'},
            {Name: 'Required', Type: 'boolean', Value: 'Yes'},
            {Name: 'DisplayInListName', Type: 'boolean', Value: 'Yes'},
            {Name: 'MaxLength', Type: 'number', Value: '15'}
        ];

        //Act
        form.FillAndSubmit(conflictingFieldData);

        //Assert
        expect(fieldsList.GetListItems().count()).toEqual(2);
    });

    it('should be able to delete first item', function ():void {
        //Arrange
        var fieldsList:PageObjects.EntityList = PageObjects.EntityList.Current();
        var confirmDialog:PageObjects.ConfirmDialog = PageObjects.ConfirmDialog.Current();

        //Act
        fieldsList.DeleteItem(1);
        confirmDialog.Confirm();

        //Assert
        expect(fieldsList.GetListItems().count()).toEqual(1);
    });

    it('should be able to recreate previously deleted \'boolean\' field', function ():void {
        //Arrange
        var form:PageObjects.Form = PageObjects.Form.Current();
        var fieldsList:PageObjects.EntityList = PageObjects.EntityList.Current();

        //Act
        form.FillAndSubmit(fields[0]);

        //Assert
        expect(fieldsList.GetListItems().count()).toEqual(2);
    });

    it('should be able to create \'date\' field type', function ():void {
        //Arrange
        var form:PageObjects.Form = PageObjects.Form.Current();
        var fieldsList:PageObjects.EntityList = PageObjects.EntityList.Current();

        //Act
        form.FillAndSubmit(fields[2]);

        //Assert
        expect(fieldsList.GetListItems().count()).toEqual(3);
    });

    it('should be able to create \'list\' field type', function ():void {
        //Arrange
        var form:PageObjects.Form = PageObjects.Form.Current();
        var fieldsList:PageObjects.EntityList = PageObjects.EntityList.Current();

        //Act
        form.FillAndSubmit(fields[3]);

        //Assert
        expect(fieldsList.GetListItems().count()).toEqual(4);
    });

    it('should be able to create \'select\' field type', function ():void {
        //Arrange
        var form:PageObjects.Form = PageObjects.Form.Current();
        var fieldsList:PageObjects.EntityList = PageObjects.EntityList.Current();

        //Act
        form.FillAndSubmit(fields[4]);

        //Assert
        expect(fieldsList.GetListItems().count()).toEqual(5);
    });

    it('should be able to create \'textarea\' field type', function ():void {
        //Arrange
        var form:PageObjects.Form = PageObjects.Form.Current();
        var fieldsList:PageObjects.EntityList = PageObjects.EntityList.Current();

        //Act
        form.FillAndSubmit(fields[5]);

        //Assert
        expect(fieldsList.GetListItems().count()).toEqual(6);
    });

    it('should be able to create \'relationship\' field type', function ():void {
        //Arrange
        var form:PageObjects.Form = PageObjects.Form.Current();
        var fieldsList:PageObjects.EntityList = PageObjects.EntityList.Current();

        //Act
        form.FillAndSubmit(fields[6]);

        //Assert
        expect(fieldsList.GetListItems().count()).toEqual(7);
    });

    it('should be able to create \'number\' field type', function ():void {
        //Arrange
        var form:PageObjects.Form = PageObjects.Form.Current();
        var fieldsList:PageObjects.EntityList = PageObjects.EntityList.Current();

        //Act
        form.FillAndSubmit(fields[7]);

        //Assert
        expect(fieldsList.GetListItems().count()).toEqual(8);
    });

    it('should be able to create \'email\' field type', function ():void {
        //Arrange
        var form:PageObjects.Form = PageObjects.Form.Current();
        var fieldsList:PageObjects.EntityList = PageObjects.EntityList.Current();

        //Act
        form.FillAndSubmit(fields[8]);

        //Assert
        expect(fieldsList.GetListItems().count()).toEqual(9);
    });

    it('should redirect to empty entity list when list of entities icon is clicked', function ():void {
        //Arrange
        var headerIcons:PageObjects.HeaderIcons = PageObjects.HeaderIcons.Current();
        var recordsList:PageObjects.EntityList = PageObjects.EntityList.Current();
        var form:PageObjects.Form = PageObjects.Form.Current();

        //Act
        headerIcons.FieldsList.ListOfEntities.click();

        //Assert
        expect(PageObjects.Browser.CurrentUrl()).toMatch(PageObjects.EntityRecordForm.UrlForEntityCreate('first_entity'));
        expect(recordsList.GetListItems().count()).toEqual(0);
        expect(form.FormFields.count()).toEqual(9);
    });
});
