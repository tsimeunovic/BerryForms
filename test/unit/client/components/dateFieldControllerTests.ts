/// <reference path="../../../jasmine.d.ts" />
/// <reference path="../../mocks/scopeMock.ts" />
/// <reference path="../../../../client/extensions/stringExtensions.ts" />
/// <reference path="../../../../client/angular/models/core/entityModel.ts" />
/// <reference path="../../../../client/angular/components/fieldTypes/date/dateFieldMetadataModel.ts" />
/// <reference path="../../../../client/angular/components/fieldTypes/date/dateFieldController.ts" />

describe('Field Controller: DateFieldController', function ():void {
    var scopeMock:any;
    var entity:Models.Entity;
    var fieldMetadata:Models.DateFieldMetadata;
    var systemUnderTest:Components.FieldTypes.DateFieldController;

    var createDateFieldController:() => void = function ():void {
        systemUnderTest = new Components.FieldTypes.DateFieldController(scopeMock);
    };

    beforeEach(function ():void {
        entity = new Models.Entity('Test');
        fieldMetadata = new Models.DateFieldMetadata();
        fieldMetadata.FieldSystemName = 'TestField';
        fieldMetadata.MinDate = Date.UTC(2014, 11, 30);
        fieldMetadata.MaxDate = Date.UTC(2015, 1, 2);

        scopeMock = new Mocks.ScopeMock();
        scopeMock.Entity = entity;
        scopeMock.field = fieldMetadata;
        createDateFieldController();
    });

    it('should parse value from Entity upon load', function ():void {
        //Arrange
        entity.Data.TestField = Date.UTC(2015, 0, 1); //Utc timestamp for January 1st, 2015
        var localOffset:number = (new Date(entity.Data.TestField)).getTimezoneOffset();
        var january1stLocalISOString:string = localOffset < 0 ?
            '2014-12-31T' :
            '2015-01-01T';

        //Act
        createDateFieldController();

        //Assert
        expect(systemUnderTest.LocalDate.toString()).toMatch(january1stLocalISOString);
    });

    it('should toggle \'Opened\' property when \'ToggleOpen\' method is called', function ():void {
        //Arrange
        //Act
        systemUnderTest.ToggleOpen(null);
        var opened1:boolean = systemUnderTest.Opened;
        systemUnderTest.ToggleOpen(null);
        var opened2:boolean = systemUnderTest.Opened;

        //Assert
        expect(opened1).toEqual(true);
        expect(opened2).toEqual(false);
    });

    it('should enable days that are between \'MinDate\' and \'MaxDate\'', function ():void {
        //Arrange
        //Act
        var disabledLow:boolean = systemUnderTest.IsDisabled(new Date('2014-11-15'), 'day');
        var disabledBetween:boolean = systemUnderTest.IsDisabled(new Date('2015-01-15'), 'day');
        var disabledHigh:boolean = systemUnderTest.IsDisabled(new Date('2015-02-15'), 'day');

        //Assert
        expect(disabledLow).toEqual(true);
        expect(disabledBetween).toEqual(false);
        expect(disabledHigh).toEqual(true);
    });

    it('should enable only months that contain any enabled day', function ():void {
        //Arrange
        //Act
        var disabledNov:boolean = systemUnderTest.IsDisabled(new Date('2014-11-01'), 'month');
        var disabledDec:boolean = systemUnderTest.IsDisabled(new Date('2014-12-01'), 'month');
        var disabledJan:boolean = systemUnderTest.IsDisabled(new Date('2015-01-01'), 'month');
        var disabledFeb:boolean = systemUnderTest.IsDisabled(new Date('2015-02-01'), 'month');
        var disabledMar:boolean = systemUnderTest.IsDisabled(new Date('2015-03-01'), 'month');

        //Assert
        expect(disabledNov).toEqual(true);
        expect(disabledDec).toEqual(false);
        expect(disabledJan).toEqual(false);
        expect(disabledFeb).toEqual(false);
        expect(disabledMar).toEqual(true);
    });

    it('should enable only years that contain any enabled day', function ():void {
        //Arrange
        //Act
        var disabled2013:boolean = systemUnderTest.IsDisabled(new Date('2013-01-01'), 'year');
        var disabled2014:boolean = systemUnderTest.IsDisabled(new Date('2014-01-01'), 'year');
        var disabled2015:boolean = systemUnderTest.IsDisabled(new Date('2015-01-01'), 'year');
        var disabled2016:boolean = systemUnderTest.IsDisabled(new Date('2016-01-01'), 'year');

        //Assert
        expect(disabled2013).toEqual(true);
        expect(disabled2014).toEqual(false);
        expect(disabled2015).toEqual(false);
        expect(disabled2016).toEqual(true);
    });

    it('should update entity when \'UIValueChanged\' is called', function ():void {
        //Arrange
        entity.Data = {};
        var localDateTime:number = new Date('2015-01-01').setHours(0);
        systemUnderTest.LocalDate = new Date(localDateTime);

        //Act
        systemUnderTest.UIValueChanged();

        //Assert
        expect(entity.Data.TestField).toEqual(Date.UTC(2015, 0, 1));
    });

    it('should update \'LocalDate\' when watch value change', function ():void {
        //Arrange
        entity.Data.TestField = Date.UTC(2015, 3, 1); //Utc timestamp for April 1st, 2015
        var localOffset:number = (new Date(entity.Data.TestField)).getTimezoneOffset();
        var april1stLocalISOString:string = localOffset < 0 ?
            '2015-03-31T' :
            '2015-04-01T';

        //Act
        scopeMock.ExecuteWatcher('Entity.Data[field.FieldSystemName]');

        //Assert
        expect(systemUnderTest.LocalDate.toString()).toMatch(april1stLocalISOString);
    });
});
