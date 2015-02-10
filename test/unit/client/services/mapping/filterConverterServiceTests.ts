/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/fieldTypesRegistryMock.ts" />
/// <reference path="../../../../../client/angular/services/mapping/filterConverterService.ts" />

'use strict';

describe('Service: FilterConverterService', function () {
    var systemUnderTest:Services.FilterConverterService;
    var fieldTypesRegistryMock:Components.FieldTypes.IFieldTypesRegistry;

    beforeEach(function () {
        fieldTypesRegistryMock = new Mocks.FieldTypesRegistryMock();
        systemUnderTest = new Services.FilterConverterService(fieldTypesRegistryMock);
    });

    it('should be able to create database query object from filter entity', function () {
        //Arrange
        var field = new Models.FieldMetadata('MockFieldMetadata');
        field.FieldSystemName = 'MockFieldSystemName';
        var metadata = new Models.EntityMetadata();
        metadata.Fields = [field];

        var filterEntity = new Models.Entity('MockEntity');
        var filterFieldValue1 = 'MockFieldValue1';
        var filterFieldValue2 = 'MockFieldValue2';
        filterEntity.Data['MockFieldSystemName1'] = filterFieldValue1;
        filterEntity.Data['MockFieldSystemName2'] = filterFieldValue2;

        //Act
        var databaseQuery = systemUnderTest.CreateDatabaseQueryFromFilter(metadata, filterEntity);

        //Assert
        expect(databaseQuery).not.toEqual(null);
        expect(databaseQuery).toEqual({
            MockFieldSystemName0: filterFieldValue1,
            MockFieldSystemName1: filterFieldValue2
        });
    });

    it('should be able to create filter form from entity metadata', function () {
        //Arrange
        var field1 = new Models.FieldMetadata('MockFieldMetadata1');
        field1.FieldSystemName = 'MockFieldSystemName1';
        var field2 = new Models.FieldMetadata('MockFieldMetadata2');
        field2.FieldSystemName = 'MockFieldSystemName2';
        var metadata = new Models.EntityMetadata();
        metadata.Fields = [field1, field2];

        //Act
        var form = systemUnderTest.CreateFilterFormMetadataFromEntityMetadata(metadata);

        //Assert
        expect(form).not.toEqual(null);
        expect(form.Fields.length).toEqual(4);
        expect(form.Fields[0].FieldSystemName).toEqual('MockFieldSystemName11');
        expect(form.Fields[1].FieldSystemName).toEqual('MockFieldSystemName12');
        expect(form.Fields[2].FieldSystemName).toEqual('MockFieldSystemName21');
        expect(form.Fields[3].FieldSystemName).toEqual('MockFieldSystemName22');
    });

    it('should be able to convert query string parameters into the filter entity', function () {
        //Arrange
        var field1 = new Models.FieldMetadata('MockFieldMetadata1');
        field1.FieldSystemName = 'MockFieldSystemName1';
        var field2 = new Models.FieldMetadata('MockFieldMetadata2');
        field2.FieldSystemName = 'MockFieldSystemName2';
        var metadata = new Models.EntityMetadata();
        metadata.Fields = [field1, field2];

        var queryStringParams = {
            MockFieldSystemName11: 11,
            MockFieldSystemName12: 12,
            MockFieldSystemName21: 21,
            MockFieldSystemName22: 22
        };

        //Act
        var filterEntity = systemUnderTest.ParseFilterQueryString(metadata, queryStringParams);

        //Assert
        expect(filterEntity).not.toEqual(null);
        expect(Object.keys(filterEntity.Data).length).toEqual(4);
        expect(filterEntity.Data['MockFieldSystemName11']).toEqual(11);
        expect(filterEntity.Data['MockFieldSystemName12']).toEqual(12);
        expect(filterEntity.Data['MockFieldSystemName21']).toEqual(21);
        expect(filterEntity.Data['MockFieldSystemName22']).toEqual(22);
    });

    it('should be able to create query string parameters from filter entity', function () {
        //Arrange
        var field1 = new Models.FieldMetadata('MockFieldMetadata1');
        field1.FieldSystemName = 'MockFieldSystemName1';
        var field2 = new Models.FieldMetadata('MockFieldMetadata2');
        field2.FieldSystemName = 'MockFieldSystemName2';
        var metadata = new Models.EntityMetadata();
        metadata.Fields = [field1, field2];

        var filterEntity = new Models.Entity('MockEntitySystemName');
        filterEntity.Data['MockFieldSystemName11'] = 11;
        filterEntity.Data['MockFieldSystemName12'] = 12;
        filterEntity.Data['MockFieldSystemName21'] = 21;
        filterEntity.Data['MockFieldSystemName22'] = 22;

        //Act
        var queryParams = systemUnderTest.CreateFilterQueryString(metadata, filterEntity);

        //Assert
        expect(queryParams).not.toEqual(null);
        expect(queryParams).toEqual('MockFieldSystemName10=11&MockFieldSystemName11=12&MockFieldSystemName20=21&MockFieldSystemName21=22');
    });
});
