/// <reference path="../../../jasmine.d.ts" />
/// <reference path="../../mocks/scopeMock.ts" />
/// <reference path="../../mocks/documentMock.ts" />
/// <reference path="../../../../client/extensions/stringExtensions.ts" />
/// <reference path="../../../../client/angular/models/core/entityModel.ts" />
/// <reference path="../../../../client/angular/components/fieldTypes/select/selectFieldMetadataModel.ts" />
/// <reference path="../../../../client/angular/components/fieldTypes/select/selectFieldController.ts" />

describe('Field Controller: SelectFieldController', function ():void {
    var scopeMock:any;
    var documentMock:any;
    var entity:Models.Entity;
    var fieldMetadata:Models.SelectFieldMetadata;
    var systemUnderTest:Components.FieldTypes.SelectFieldController;

    var createSelectFieldController:() => void = function ():void {
        systemUnderTest = new Components.FieldTypes.SelectFieldController(scopeMock, documentMock);
    };

    beforeEach(function ():void {
        entity = new Models.Entity('Test');
        fieldMetadata = new Models.SelectFieldMetadata();
        fieldMetadata.Values = [
            new Models.SelectFieldOptionMetadata('Value1', null),
            new Models.SelectFieldOptionMetadata('Value2', null),
            new Models.SelectFieldOptionMetadata('Value3', null)
        ];
        fieldMetadata.FieldSystemName = 'TestField';

        scopeMock = new Mocks.ScopeMock();
        scopeMock.Entity = entity;
        scopeMock.field = fieldMetadata;

        documentMock = new Mocks.DocumentMock();

        createSelectFieldController();
    });

    it('should initialize bound value after creation when no value and no default value is present', function ():void {
        //Arrange
        //Act
        //Assert
        var boundValue:Models.SelectFieldOptionMetadata = systemUnderTest.GetBoundFieldValue();
        expect(boundValue).toBeTruthy();
        expect(boundValue.Text).toEqual('');
        expect(boundValue.Value).toEqual('');
    });

    it('should initialize bound value to default string when no value is present', function ():void {
        //Arrange
        systemUnderTest.SetBoundFieldValue(null);
        fieldMetadata.DefaultValue = new Models.SelectFieldOptionMetadata('DefaultValue', null);

        //Act
        createSelectFieldController();

        //Assert
        var boundValue:Models.SelectFieldOptionMetadata = systemUnderTest.GetBoundFieldValue();
        expect(boundValue).toEqual(fieldMetadata.DefaultValue);
    });

    it('should update bound value and close dialog when option is selected', function ():void {
        //Arrange
        systemUnderTest.Opened = true;
        var option:Models.SelectFieldOptionMetadata = new Models.SelectFieldOptionMetadata('SomeValue', null);
        var documentUnbindHandlerSpy:any = documentMock.unbind;

        //Act
        systemUnderTest.SelectOption(null, option);

        //Assert
        expect(systemUnderTest.Opened).toEqual(false);
        expect(documentUnbindHandlerSpy.calls.any()).toEqual(true);
        expect(documentUnbindHandlerSpy.calls.first().args[0]).toEqual('click');
    });

    it('should open dialog and subscribe to document click handler when \'ToggleOpen\' is called', function ():void {
        //Arrange
        systemUnderTest.Opened = false;
        var documentBindHandlerSpy:any = documentMock.bind;

        //Act
        systemUnderTest.ToggleOpen(null);

        //Assert
        expect(systemUnderTest.Opened).toEqual(true);
        expect(documentBindHandlerSpy.calls.any()).toEqual(true);
        expect(documentBindHandlerSpy.calls.first().args[0]).toEqual('click');
    });

    it('should close dialog when document is clicked outside of dialog', function ():void {
        //Arrange
        systemUnderTest.Opened = false;
        systemUnderTest.ToggleOpen(null);
        var documentBindHandlerSpy:any = documentMock.bind;
        var documentUnbindHandlerSpy:any = documentMock.unbind;
        var documentClickHandler:(event:any) => void = documentBindHandlerSpy.calls.first().args[1];

        //Act
        documentClickHandler({});

        //Assert
        expect(systemUnderTest.Opened).toEqual(false);
        expect(documentUnbindHandlerSpy.calls.any()).toEqual(true);
        expect(documentUnbindHandlerSpy.calls.first().args[0]).toEqual('click');
    });
});
