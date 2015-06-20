/// <reference path="../../../jasmine.d.ts" />
/// <reference path="../../mocks/scopeMock.ts" />
/// <reference path="../../../../client/extensions/stringExtensions.ts" />
/// <reference path="../../../../client/angular/models/core/entityModel.ts" />
/// <reference path="../../../../client/angular/components/fieldTypes/list/listFieldMetadataModel.ts" />
/// <reference path="../../../../client/angular/components/fieldTypes/list/listFieldController.ts" />

describe('Field Controller: ListFieldController', function ():void {
    var scopeMock:any;
    var entity:Models.Entity;
    var fieldMetadata:Models.ListFieldMetadata;
    var systemUnderTest:Components.FieldTypes.ListFieldController;

    var createListFieldController:() => void = function ():void {
        systemUnderTest = new Components.FieldTypes.ListFieldController(scopeMock);
    };

    beforeEach(function ():void {
        entity = new Models.Entity('Test');
        fieldMetadata = new Models.ListFieldMetadata();
        fieldMetadata.FieldSystemName = 'TestField';
        fieldMetadata.MaxRecordLength = 10;
        fieldMetadata.MaxRecordsCount = 5;

        scopeMock = new Mocks.ScopeMock();
        scopeMock.Entity = entity;
        scopeMock.field = fieldMetadata;
        createListFieldController();
    });

    it('should add typed value to list when \'Add\' is invoked', function ():void {
        //Arrange
        systemUnderTest.CurrentValue = 'New value';

        //Act
        systemUnderTest.Add(null);

        //Assert
        expect(entity.Data.TestField).toEqual(['New value']);
        expect(systemUnderTest.CurrentValue).toEqual(null);
        expect(systemUnderTest.IsValid).toEqual(true);
    });

    it('should be able to add more than one value', function ():void {
        //Arrange
        entity.Data.TestField = ['Old value'];
        systemUnderTest.CurrentValue = 'New value';

        //Act
        systemUnderTest.Add(null);

        //Assert
        expect(entity.Data.TestField).toEqual(['Old value', 'New value']);
        expect(systemUnderTest.CurrentValue).toEqual(null);
        expect(systemUnderTest.IsValid).toEqual(true);
    });

    it('should be able to remove one of the values', function ():void {
        //Arrange
        entity.Data.TestField = ['Value1', 'Value2', 'Value3'];
        systemUnderTest.CurrentValue = 'Some value';

        //Act
        systemUnderTest.Remove(null, 'Value2');

        //Assert
        expect(entity.Data.TestField).toEqual(['Value1', 'Value3']);
        expect(systemUnderTest.CurrentValue).toEqual('Some value');
        expect(systemUnderTest.IsValid).toEqual(true);
    });

    it('should be invalid when number of values exceed \'MaxRecordsCount\'', function ():void {
        //Arrange
        entity.Data.TestField = ['Value1', 'Value2', 'Value3', 'Value4', 'Value5'];
        systemUnderTest.CurrentValue = 'Value6';

        //Act
        systemUnderTest.Add(null);

        //Assert
        expect(entity.Data.TestField).toEqual(['Value1', 'Value2', 'Value3', 'Value4', 'Value5', 'Value6']);
        expect(systemUnderTest.CurrentValue).toEqual(null);
        expect(systemUnderTest.IsValid).toEqual(false);
    });

    it('should be invalid when value length exceeds \'MaxRecordLength\'', function ():void {
        //Arrange
        systemUnderTest.CurrentValue = 'Lorem ipsum dolor sit amet';

        //Act
        systemUnderTest.Add(null);

        //Assert
        expect(entity.Data.TestField).toEqual(['Lorem ipsum dolor sit amet']);
        expect(systemUnderTest.CurrentValue).toEqual(null);
        expect(systemUnderTest.IsValid).toEqual(false);
    });
});
