/// <reference path="../../jasmine.d.ts" />
/// <reference path="../page-objects/form.ts" />
/// <reference path="../page-objects/entityList.ts" />
/// <reference path="../page-objects/filteredList.ts" />

'use strict';

describe('Feature: Filtered list', function () {
    beforeEach(function () {
        PageObjects.FilteredList.NavigateToFilteredListWithLogin('first_entity');
        var filteredList = PageObjects.FilteredList.Current();
        filteredList.ToggleExpand();
    });

    it('should contain paged list of unfiltered entities when opened', function () {
        //Arrange
        var filteredList = PageObjects.FilteredList.Current();

        //Act
        //Assert
        expect(filteredList.GetListItems().count()).toEqual(10);
        expect(filteredList.TotalPages()).toEqual('2');
    });

    it('should be able to filter by \'boolean\' field', function () {
        //Arrange
        var filteredList = PageObjects.FilteredList.Current();
        var filterObject = [
            {Name: 'booleanfield', Type: 'boolean', Value: 'No'}
        ];

        //Act
        filteredList.ApplyFilterObject(filterObject);

        //Assert
        expect(filteredList.GetListItems().count()).toEqual(8);
    });

    it('should be able to filter by \'text\' field', function () {
        //Arrange
        var filteredList = PageObjects.FilteredList.Current();
        var filterObject = [
            {Name: 'textfield', Type: 'text', Value: 'Coconut'}
        ];

        //Act
        filteredList.ApplyFilterObject(filterObject);

        //Assert
        expect(filteredList.GetListItems().count()).toEqual(1);
    });

    it('should be able to filter by \'date\' field', function () {
        //Arrange
        var filteredList = PageObjects.FilteredList.Current();
        var filterObject = [
            {Name: 'from_datefield', Type: 'date', Value: '10.10.2015'},
            {Name: 'to_datefield', Type: 'date', Value: '10.10.2015'}
        ];

        //Act
        filteredList.ApplyFilterObject(filterObject);

        //Assert
        expect(filteredList.GetListItems().count()).toEqual(8);
    });

    it('should be able to filter by \'list\' and \'date\' field at the same time', function () {
        //Arrange
        var filteredList = PageObjects.FilteredList.Current();
        var filterObject = [
            {Name: 'from_datefield', Type: 'date', Value: '5.5.2015'},
            {Name: 'to_datefield', Type: 'date', Value: '5.5.2015'},
            {Name: 'listfield', Type: 'text', Value: 'c'}
        ];

        //Act
        filteredList.ApplyFilterObject(filterObject);

        //Assert
        expect(filteredList.GetListItems().count()).toEqual(4);
    });

    it('should be able to filter by \'select\' field', function () {
        //Arrange
        var filteredList = PageObjects.FilteredList.Current();
        var filterObject = [
            {Name: 'selectfield', Type: 'select', Value: 'Pear'}
        ];

        //Act
        filteredList.ApplyFilterObject(filterObject);

        //Assert
        expect(filteredList.GetListItems().count()).toEqual(10);
        expect(filteredList.TotalPages()).toEqual('2');
    });

    it('should be able to filter by \'textarea\' field', function () {
        //Arrange
        var filteredList = PageObjects.FilteredList.Current();
        var filterObject = [
            {Name: 'textareafield', Type: 'text', Value: 'Lorem'}
        ];

        //Act
        filteredList.ApplyFilterObject(filterObject);
        filteredList.GoToNextPage();

        //Assert
        expect(filteredList.GetListItems().count()).toEqual(6);
        expect(filteredList.TotalPages()).toEqual('2');
    });

    it('should return no results when no element match query', function () {
        //Arrange
        var filteredList = PageObjects.FilteredList.Current();
        var filterObject = [
            {Name: 'selectfield', Type: 'select', Value: 'Apple'}
        ];

        //Act
        filteredList.ApplyFilterObject(filterObject);

        //Assert
        expect(filteredList.GetListItems().count()).toEqual(0);
    });

    it('should be able to filter by \'relationship\' field', function () {
        //Arrange
        var filteredList = PageObjects.FilteredList.Current();
        var filterObject = [
            {Name: 'relationshipfield', Type: 'relationship', Value: 'bana'}
        ];

        //Act
        filteredList.ApplyFilterObject(filterObject);

        //Assert
        expect(filteredList.GetListItems().count()).toEqual(1);
    });
});
