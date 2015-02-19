/// <reference path="../../jasmine.d.ts" />
/// <reference path="../helpers/valuesRotation.ts" />
/// <reference path="../page-objects/form.ts" />
/// <reference path="../page-objects/filteredList.ts" />
/// <reference path="../page-objects/entityList.ts" />
/// <reference path="../page-objects/headerIcons.ts" />
/// <reference path="../page-objects/entityRecordForm.ts" />

'use strict';

describe('Feature: Record create', function () {
    beforeEach(function () {
        PageObjects.EntityRecordForm.NavigateToCreateWithLogin('first_entity');
    });

    it('should mark required fields as invalid when they are not filled', function () {
        //Arrange
        var errorClass = 'error';
        var classAttribute = 'class';
        var form = PageObjects.Form.Current();

        //Act
        //Assert
        expect(form.FieldFor('textfield').attr(classAttribute)).toContain(errorClass);
        expect(form.FieldFor('booleanfield').attr(classAttribute)).toContain(errorClass);

        expect(form.FieldFor('selectfield').attr(classAttribute)).not().toContain(errorClass);
        expect(form.FieldFor('datefield').attr(classAttribute)).not().toContain(errorClass);
        expect(form.FieldFor('listfield').attr(classAttribute)).not().toContain(errorClass);
        expect(form.FieldFor('textareafield').attr(classAttribute)).not().toContain(errorClass);
        expect(form.FieldFor('relationshipfield').attr(classAttribute)).not().toContain(errorClass);
    });

    var rotationValues1 = {
        textfield: ['Banana', 'Orange'],
        booleanfield: ['Yes', 'No'],
        datefield: ['5.5.2015', '10.10.2015'],
        listfield: [['a', 'b', 'c'], ['1', '2', '3']],

        selectfield: ['Pear'],
        textareafield: ['Lorem ipsum dolor sit amet']
    };

    it('should be able to create entity using valid data', function () {
        //Arrange
        var totalRotations = Helpers.ValuesRotation.NumberOfRotations(rotationValues1);
        var form = PageObjects.Form.Current();
        var list = PageObjects.EntityList.Current();

        //Act
        for (var i = 0; i < totalRotations; i++) {
            var rotationObject = Helpers.ValuesRotation.GetObjectForRotation(rotationValues1, i);
            form.FillAndSubmit([
                {Name: 'textfield', Type: 'text', Value: rotationObject['textfield']},
                {Name: 'booleanfield', Type: 'boolean', Value: rotationObject['booleanfield']},
                {Name: 'datefield', Type: 'date', Value: rotationObject['datefield']},
                {Name: 'listfield', Type: 'list', Value: rotationObject['listfield']},
                {Name: 'selectfield', Type: 'select', Value: rotationObject['selectfield']},
                {Name: 'textareafield', Type: 'textarea', Value: rotationObject['textareafield']}
            ]);
        }

        //Assert
        expect(list.GetListItems().count()).toEqual(10);
        expect(list.TotalPages()).toEqual('2');
    });

    it('should be able to switch to another list page', function () {
        //Arrange
        var list = PageObjects.EntityList.Current();

        //Act
        list.GoToNextPage();

        //Assert
        expect(list.GetListItems().count()).toEqual(6);
    });

    it('should be able to create entity with relationship', function () {
        //Arrange
        var form = PageObjects.Form.Current();
        var list = PageObjects.EntityList.Current();
        var formValues = [
            {Name: 'textfield', Type: 'text', Value: 'Coconut'},
            {Name: 'booleanfield', Type: 'boolean', Value: 'Yes'},
            {Name: 'datefield', Type: 'date', Value: '5.5.2015'},
            {Name: 'listfield', Type: 'list', Value: ['x', 'y', 'z']},
            {Name: 'selectfield', Type: 'select', Value: 'Banana'},
            {Name: 'relationshipfield', Type: 'relationship', Value: 'bana'}
        ];

        //Act
        form.FillAndSubmit(formValues);
        list.GoToNextPage();

        //Assert
        expect(list.GetListItems().count()).toEqual(7);
    });

    it('should send user to filter screen when filter icon is clicked', function () {
        //Arrange
        var headerIcons = PageObjects.HeaderIcons.Current();

        //Act
        headerIcons.EntitiesList.FilteredList.click();

        //Assert
        expect(PageObjects.Browser.CurrentUrl()).toMatch(PageObjects.FilteredList.UrlForEntity('first_entity'));
    });
});
