/// <reference path="../../../jasmine.d.ts" />
/// <reference path="../../mocks/scopeMock.ts" />
/// <reference path="../../../../client/extensions/stringExtensions.ts" />
/// <reference path="../../../../client/angular/models/core/entityModel.ts" />
/// <reference path="../../../../client/angular/components/fieldTypes/number/numberFieldMetadataModel.ts" />
/// <reference path="../../../../client/angular/components/fieldTypes/number/numberFieldController.ts" />

describe('Field Controller: NumberFieldController', function ():void {
    var scopeMock:any;
    var entity:Models.Entity;
    var fieldMetadata:Models.NumberFieldMetadata;
    var systemUnderTest:Components.FieldTypes.NumberFieldController;

    var createNumberFieldController:() => void = function ():void {
        systemUnderTest = new Components.FieldTypes.NumberFieldController(scopeMock);
    };

    beforeEach(function ():void {
        entity = new Models.Entity('Test');
        fieldMetadata = new Models.NumberFieldMetadata();
        fieldMetadata.FieldSystemName = 'TestField';

        scopeMock = new Mocks.ScopeMock();
        scopeMock.Entity = entity;
        scopeMock.field = fieldMetadata;
        createNumberFieldController();
    });

    it('should update \'Value\' when watch value change', function ():void {
        //Arrange
        entity.Data.TestField = 123;

        //Act
        scopeMock.ExecuteWatcher('Entity.Data[field.FieldSystemName]');

        //Assert
        expect(systemUnderTest.Value).toEqual('123');
    });

    it('should update entity when \'UIValueChanged\' is called', function ():void {
        //Arrange
        entity.Data = {};
        systemUnderTest.Value = '18';

        //Act
        systemUnderTest.UIValueChanged();

        //Assert
        expect(entity.Data.TestField).toEqual(18);
    });
});
