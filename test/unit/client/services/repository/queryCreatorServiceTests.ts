/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../../../client/angular/components/fieldTypes/boolean/booleanFieldMetadataModel.ts" />
/// <reference path="../../../../../client/angular/components/fieldTypes/text/textFieldMetadataModel.ts" />
/// <reference path="../../../../../client/angular/components/fieldTypes/select/selectFieldMetadataModel.ts" />
/// <reference path="../../../../../client/angular/services/repository/queryCreatorService.ts" />

'use strict';

describe('Service: QueryCreatorService', function () {
    var systemUnderTest:Services.QueryCreatorService;

    beforeEach(function () {
        systemUnderTest = new Services.QueryCreatorService();
    });

    it('should be able create query from first text-searchable field that is displayed in list', function () {
        //Arrange
        var metadata = new Models.EntityMetadata();
        var field1 = new Models.BooleanFieldMetadata();
        field1.DisplayInListName = true;
        field1.FieldSystemName = 'field1';
        var field2 = new Models.TextFieldMetadata();
        field2.FieldSystemName = 'field2';
        var field3 = new Models.SelectFieldMetadata();
        field3.DisplayInListName = true;
        field3.FieldSystemName = 'field3';
        var field4 = new Models.TextFieldMetadata();
        field4.DisplayInListName = true;
        field4.FieldSystemName = 'field4';
        var field5 = new Models.SelectFieldMetadata();
        field5.DisplayInListName = true;
        field5.FieldSystemName = 'field5';
        metadata.Fields = [
            field1,
            field2,
            field3,
            field4,
            field5
        ];

        //Act
        var query = systemUnderTest.CreateRelationSearchQuery(metadata, 'SearchExpression');

        //Assert
        expect(query).not.toEqual(null);
        var expectedQuery = {'Data.field3.Text': {$regex: 'SearchExpression', $options: 'i'}};
        expect(query).toEqual(expectedQuery);
    });
});
