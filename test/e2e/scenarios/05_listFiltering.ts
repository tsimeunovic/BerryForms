/// <reference path="../../jasmine.d.ts" />
/// <reference path="../page-objects/form.ts" />
/// <reference path="../page-objects/entityList.ts" />
/// <reference path="../page-objects/filteredList.ts" />

'use strict';

describe('Feature: Filtered list', function ():void {
    beforeEach(function ():void {
        PageObjects.FilteredList.NavigateToFilteredListWithLogin('first_entity');
        var filteredList:PageObjects.FilteredList = PageObjects.FilteredList.Current();
        filteredList.ToggleExpand();
    });

    it('should contain paged list of unfiltered entities when opened', function ():void {
        //Arrange
        var filteredList:PageObjects.FilteredList = PageObjects.FilteredList.Current();

        //Act
        //Assert
        expect(filteredList.GetListItems().count()).toEqual(10);
        expect(filteredList.TotalPages()).toEqual('2');
    });

    it('should be able to filter by \'boolean\' field', function ():void {
        //Arrange
        var filteredList:PageObjects.FilteredList = PageObjects.FilteredList.Current();
        var filterObject:any[] = [
            {Name: 'booleanfield', Type: 'boolean', Value: 'No'}
        ];

        //Act
        filteredList.ApplyFilterObject(filterObject);

        //Assert
        expect(filteredList.GetListItems().count()).toEqual(8);
    });

    it('should be able to filter by \'text\' field', function ():void {
        //Arrange
        var filteredList:PageObjects.FilteredList = PageObjects.FilteredList.Current();
        var filterObject:any[] = [
            {Name: 'textfield', Type: 'text', Value: 'Coconut'}
        ];

        //Act
        filteredList.ApplyFilterObject(filterObject);

        //Assert
        expect(filteredList.GetListItems().count()).toEqual(1);
    });

    it('should be able to filter by \'date\' field', function ():void {
        //Arrange
        var filteredList:PageObjects.FilteredList = PageObjects.FilteredList.Current();
        var filterObject:any[] = [
            {Name: 'from_datefield', Type: 'date', Value: '10.10.2015'},
            {Name: 'to_datefield', Type: 'date', Value: '10.10.2015'}
        ];

        //Act
        filteredList.ApplyFilterObject(filterObject);

        //Assert
        expect(filteredList.GetListItems().count()).toEqual(8);
    });

    it('should be able to filter by \'list\' and \'date\' field at the same time', function ():void {
        //Arrange
        var filteredList:PageObjects.FilteredList = PageObjects.FilteredList.Current();
        var filterObject:any[] = [
            {Name: 'from_datefield', Type: 'date', Value: '5.5.2015'},
            {Name: 'to_datefield', Type: 'date', Value: '5.5.2015'},
            {Name: 'listfield', Type: 'text', Value: 'c'}
        ];

        //Act
        filteredList.ApplyFilterObject(filterObject);

        //Assert
        expect(filteredList.GetListItems().count()).toEqual(4);
    });

    it('should be able to filter by \'select\' field', function ():void {
        //Arrange
        var filteredList:PageObjects.FilteredList = PageObjects.FilteredList.Current();
        var filterObject:any[] = [
            {Name: 'selectfield', Type: 'select', Value: 'Pear'}
        ];

        //Act
        filteredList.ApplyFilterObject(filterObject);

        //Assert
        expect(filteredList.GetListItems().count()).toEqual(10);
        expect(filteredList.TotalPages()).toEqual('2');
    });

    it('should be able to filter by \'textarea\' field', function ():void {
        //Arrange
        var filteredList:PageObjects.FilteredList = PageObjects.FilteredList.Current();
        var filterObject:any[] = [
            {Name: 'textareafield', Type: 'text', Value: 'Lorem'}
        ];

        //Act
        filteredList.ApplyFilterObject(filterObject);
        filteredList.GoToNextPage();

        //Assert
        expect(filteredList.GetListItems().count()).toEqual(6);
        expect(filteredList.TotalPages()).toEqual('2');
    });

    it('should return no results when no element match query', function ():void {
        //Arrange
        var filteredList:PageObjects.FilteredList = PageObjects.FilteredList.Current();
        var filterObject:any[] = [
            {Name: 'selectfield', Type: 'select', Value: 'Apple'}
        ];

        //Act
        filteredList.ApplyFilterObject(filterObject);

        //Assert
        expect(filteredList.GetListItems().count()).toEqual(0);
    });

    it('should be able to filter by \'relationship\' field', function ():void {
        //Arrange
        var filteredList:PageObjects.FilteredList = PageObjects.FilteredList.Current();
        var filterObject:any[] = [
            {Name: 'relationshipfield', Type: 'relationship', Value: 'bana'}
        ];

        //Act
        filteredList.ApplyFilterObject(filterObject);

        //Assert
        expect(filteredList.GetListItems().count()).toEqual(1);
    });

    it('should be able to filter by \'number\' field', function ():void {
        //Arrange
        var filteredList:PageObjects.FilteredList = PageObjects.FilteredList.Current();
        var filterObject:any[] = [
            {Name: 'from_numberfield', Type: 'number', Value: '20'},
            {Name: 'to_numberfield', Type: 'number', Value: '30'}
        ];

        //Act
        filteredList.ApplyFilterObject(filterObject);

        //Assert
        expect(filteredList.GetListItems().count()).toEqual(10);
        expect(filteredList.TotalPages()).toEqual('2');
    });
});
