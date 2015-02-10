/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/callbackMock.ts" />
/// <reference path="../../../../../client/angular/services/system/namingConventionsService.ts" />

'use strict';

describe('Service: NamingConventionsService', function () {
    var systemUnderTest:Services.NamingConventionsService;

    beforeEach(function () {
        systemUnderTest = new Services.NamingConventionsService();
    });

    it('should replace all spaces with underscore and replace special characters for entity system name', function () {
        //Arrange
        var entityName = 'Entity name with spaces ľščťžýáíé';

        //Act
        var entitySystemName = systemUnderTest.GetSystemEntityName(entityName);

        //Assert
        expect(entitySystemName).toEqual('entity_name_with_spaces_lsctzyaie');
    });

    it('should trim spaces and replace special characters for field system name', function () {
        //Arrange
        var fieldName = 'Field name with spaces ľščťžýáíé';

        //Act
        var fieldSystemName = systemUnderTest.GetSystemFieldName(fieldName);

        //Assert
        expect(fieldSystemName).toEqual('fieldnamewithspaceslsctzyaie');
    });
});
