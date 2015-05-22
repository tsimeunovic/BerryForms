/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/namingConventionsServiceMock.ts" />
/// <reference path="../../../mocks/fieldTypesRegistryMock.ts" />
/// <reference path="../../../mocks/notificationServiceMock.ts" />
/// <reference path="../../../mocks/localizationServiceMock.ts" />
/// <reference path="../../../../../client/angular/interfaces/services/system/INamingConventionsService.ts" />
/// <reference path="../../../../../client/angular/interfaces/services/interaction/INotificationService.ts" />
/// <reference path="../../../../../client/angular/services/mapping/entityModelMapperService.ts" />

'use strict';

describe('Service: EntityModelMapperService', function ():void {
    var systemUnderTest:Services.EntityModelMapperService;
    var namingConventionsServiceMock:Services.INamingConventionsService;
    var fieldTypesRegistryMock:Components.FieldTypes.IFieldTypesRegistry;
    var notificationServiceMock:Services.INotificationService;
    var localizationServiceMock:Services.ILocalizationService;

    beforeEach(function ():void {
        namingConventionsServiceMock = new Mocks.NamingConventionsServiceMock();
        fieldTypesRegistryMock = new Mocks.FieldTypesRegistryMock();
        notificationServiceMock = new Mocks.NotificationServiceMock();
        localizationServiceMock = new Mocks.LocalizationServiceMock();

        systemUnderTest = new Services.EntityModelMapperService(namingConventionsServiceMock,
            fieldTypesRegistryMock, notificationServiceMock, localizationServiceMock);
    });

    it('should correctly map \'entity model\' to \'metadata model\'', function ():void {
        //Arrange
        var entity:Models.Entity = new Models.Entity('test');
        var entityName:string = 'Name of entity';
        entity.Data.EntityName = entityName;
        var entityDescription:string = 'Description of entity';
        entity.Data.EntityDescription = entityDescription;
        var iconClass:string = 'IconClass';
        entity.Data.IconClassName = {Value: '__icon__' + iconClass};
        var iconColor:string = 'IconColor';
        entity.Data.IconColorHex = {Value: '__color__' + iconColor};

        //Act
        var result:Models.EntityMetadata = systemUnderTest.MapEntityToEntityMetadataModel(entity);

        //Assert
        expect(result).not.toEqual(null);
        expect(result.Id).not.toBeDefined();
        expect(result.EntityName).toEqual(entityName);
        expect(result.EntitySystemName).toEqual('#' + entityName);
        expect(result.EntityDescription).toEqual(entityDescription);
        expect(result.IconClassName).toEqual(iconClass);
        expect(result.IconColorHex).toEqual(iconColor);
        expect(result.Fields).toEqual([]);
    });

    it('should correctly map \'field models\' to \'entity models\'', function ():void {
        //Arrange
        var mockField:Mocks.FieldTypeMock = new Mocks.FieldTypeMock();
        var fieldMetadataName:string = 'TestField';
        var fieldMetadataSystemName:string = 'TestFieldSystemName';
        var fieldMetadataDescription:string = 'TestFieldDescription';
        var testMetadata:Models.FieldMetadata = new Models.FieldMetadata(fieldMetadataName);
        testMetadata.FieldSystemName = fieldMetadataSystemName;
        testMetadata.FieldDescription = fieldMetadataDescription;

        var specialPropertyName:string = 'Special';
        var specialPropertyValue:string = 'SpecialValue';
        testMetadata.FieldSpecialProperties = [specialPropertyName];
        testMetadata[specialPropertyName] = specialPropertyValue;

        var additionalPropertyName:string = 'Additional';
        var additionalPropertyValue:string = 'AdditionalValue';
        testMetadata.MapAdditionalProperties = function (entity:Models.Entity):void {
            entity.Data[additionalPropertyName] = additionalPropertyValue;
        };

        //Act
        var fields:Models.FieldMetadata[] = [testMetadata, testMetadata, testMetadata];
        var result:Models.Entity[] = systemUnderTest.MapFieldsMetadataToEntityModels(fields);

        //Assert
        expect(result).not.toEqual(null);
        expect(result.length).toEqual(3);
        var firstFieldEntity:Models.Entity = result[0];
        expect(firstFieldEntity.EntitySystemName).toEqual(fieldMetadataSystemName);
        expect(firstFieldEntity.Data.FieldTypeName.Text).toEqual(mockField.FieldName);
        expect(firstFieldEntity.Data.FieldTypeName.Value).toEqual(mockField.FieldName);
        expect(firstFieldEntity.Data.FieldDescription).toEqual(fieldMetadataDescription);
        expect(firstFieldEntity.Data[specialPropertyName]).toEqual(specialPropertyValue);
        expect(firstFieldEntity.Data[additionalPropertyName]).toEqual(additionalPropertyValue);
    });

    it('should correctly map \'entity model\' to \'field model\'', function ():void {
        //Arrange
        var getRegistryFieldMethodMock:any = fieldTypesRegistryMock.GetFieldType;
        var entitySystemName:string = 'EntitySystemName';
        var entity:Models.Entity = new Models.Entity(entitySystemName);
        var fieldTypeName:string = 'FieldTypeName';
        entity.Data.FieldTypeName = new Models.SelectFieldOptionMetadata(fieldTypeName, null);
        var fieldDescription:string = 'FieldDescription';
        entity.Data.FieldDescription = fieldDescription;
        var required:boolean = true;
        entity.Data.Required = required;
        var specialValue:string = 'SpecialValue';
        entity.Data.Special = specialValue;

        //Act
        var result:Models.FieldMetadata = systemUnderTest.MapEntityModelToFieldMetadata(entity);

        //Assert
        expect(getRegistryFieldMethodMock.calls.first().args[0]).toEqual(fieldTypeName);
        expect(result).not.toEqual(null);
        expect(result.FieldDescription).toEqual(fieldDescription);
        expect(result.Required).toEqual(required);
        expect(result.FieldSystemName).toEqual('#MockFieldName'); //From FieldTypeMock
        /* tslint:disable:no-string-literal */
        expect(result['Additional']).toEqual('AdditionalValue'); //From FieldTypeMock
        expect(result['Special']).toEqual(specialValue);
    });

    it('should notify user when non-registered field is used', function ():void {
        //Arrange
        var getRegistryFieldMethodMock:any = fieldTypesRegistryMock.GetFieldType;
        var notifyCallsMock:any = notificationServiceMock.NotifyMessage;
        var entitySystemName:string = 'EntitySystemName';
        var entity:Models.Entity = new Models.Entity(entitySystemName);
        var fieldTypeName:string = 'UnknownTypeName';
        entity.Data.FieldTypeName = new Models.SelectFieldOptionMetadata(fieldTypeName, null);

        //Act
        var result:Models.FieldMetadata = systemUnderTest.MapEntityModelToFieldMetadata(entity);

        //Assert
        expect(getRegistryFieldMethodMock.calls.first().args[0]).toEqual(fieldTypeName);
        expect(notifyCallsMock.calls.first().args[0]).toEqual('#NonExistingFieldType');
        expect(result).toEqual(null);
    });

    it('should be able to deserialize metadata JSON object to \'metadata model\'', function ():void {
        //Arrange
        var getRegistryFieldMethodMock:any = fieldTypesRegistryMock.GetFieldType;
        var json:any = {
            EntityName: 'TestMetadata',
            EntityDescription: 'TestMetadata',
            EntitySystemName: 'test_metadata',
            IconClassName: 'icon',
            IconColorHex: '#hex',
            Id: 'test_metadata',
            CreatedDate: '2014-12-01T12:00:00.000Z',
            CreatedBy: 'CreateUser',
            ModifiedDate: '2014-12-12T12:00:00.000Z',
            ModifiedBy: 'ModifyUser',
            CustomProperty: 'CustomValue',
            Fields: [
                {
                    FieldSpecialProperties: [
                        'Special'
                    ],
                    FieldTypeName: 'Mock',
                    Configuration: null,
                    FieldName: 'TestField',
                    Required: true,
                    DisplayInListName: true,
                    RegularExpression: '',
                    MaxLength: 50,
                    FieldSystemName: 'mock'
                }
            ]
        };

        //Act
        var result:Models.EntityMetadata = systemUnderTest.DeserializeEntityMetadataModel(json);

        //Assert
        expect(result).not.toEqual(null);
        expect(result.EntityName).toEqual(json.EntityName);
        expect(result.EntityDescription).toEqual(json.EntityDescription);
        expect(result.EntitySystemName).toEqual(json.EntitySystemName);
        expect(result.IconClassName).toEqual(json.IconClassName);
        expect(result.IconColorHex).toEqual(json.IconColorHex);
        expect(result.Id).toEqual(json.Id);
        expect(result.CreatedDate).toEqual(json.CreatedDate);
        expect(result.CreatedBy).toEqual(json.CreatedBy);
        expect(result.ModifiedDate).toEqual(json.ModifiedDate);
        expect(result.ModifiedBy).toEqual(json.ModifiedBy);
        /* tslint:disable:no-string-literal */
        expect(result['CustomProperty']).toEqual(json.CustomProperty);

        expect(result.Fields.length).toEqual(1);
        expect(getRegistryFieldMethodMock.calls.first().args[0]).toEqual(json.Fields[0].FieldTypeName);
        var firstField:any = result.Fields[0];
        expect(firstField.MaxLength).toEqual(json.Fields[0].MaxLength);
        expect(firstField.FieldSystemName).toEqual(json.Fields[0].FieldSystemName);
        expect(firstField.Required).toEqual(json.Fields[0].Required);
    });

    it('should be able to deserialize entity JSON object to \'entity model\'', function ():void {
        //Arrange
        var json:any = {
            ErrorFields: [],
            Id: 128,
            CreatedDate: 1417435200000,
            CreatedBy: 'CreateUser',
            ModifiedDate: 1418385600000,
            ModifiedBy: 'ModifyUser',
            EntitySystemName: 'test_metadata',
            Data: {
                option: {
                    Value: 'Value',
                    Text: 'Text'
                },
                number: '40',
                description: 'Description',
                bool: true
            }
        };

        //Act
        var result:Models.Entity = systemUnderTest.DeserializeEntityModel(json);

        //Assert
        expect(result).not.toEqual(null);
        expect(result.Id).toEqual(json.Id);
        expect(result.CreatedDate).toEqual(json.CreatedDate);
        expect(result.CreatedBy).toEqual(json.CreatedBy);
        expect(result.ModifiedDate).toEqual(json.ModifiedDate);
        expect(result.ModifiedBy).toEqual(json.ModifiedBy);
        expect(result.EntitySystemName).toEqual(json.EntitySystemName);
        expect(result.Data).toEqual(json.Data);
    });

    it('should be able to clone \'entity model\'', function ():void {
        //Arrange
        var entity:Models.Entity = new Models.Entity('testEntity');
        entity.EntitySystemName = 'systemName';
        entity.Id = 12;
        entity.CreatedDate = 1417435200000;
        entity.CreatedBy = 'CreateUser';
        entity.ModifiedDate = 1418385600000;
        entity.ModifiedBy = 'ModifyUser';
        entity.Data = {a: 'a'};

        //Act
        var result:Models.Entity = systemUnderTest.CloneEntityModel(entity);

        //Assert
        expect(result).not.toEqual(null);
        expect(result).toEqual(entity);
        expect(result).not.toBe(entity);
        expect(result.Data).toEqual(entity.Data);
        expect(result.Data).not.toBe(entity.Data);
    });
});
