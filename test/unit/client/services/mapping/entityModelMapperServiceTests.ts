/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/namingConventionsServiceMock.ts" />
/// <reference path="../../../mocks/fieldTypesRegistryMock.ts" />
/// <reference path="../../../mocks/NotificationServiceMock.ts" />
/// <reference path="../../../mocks/LocalizationServiceMock.ts" />
/// <reference path="../../../../../client/angular/interfaces/services/system/INamingConventionsService.ts" />
/// <reference path="../../../../../client/angular/interfaces/services/interaction/INotificationService.ts" />
/// <reference path="../../../../../client/angular/services/mapping/entityModelMapperService.ts" />

'use strict';

describe('Service: EntityModelMapperService', function () {
    var systemUnderTest:Services.EntityModelMapperService;
    var namingConventionsServiceMock:Services.INamingConventionsService;
    var fieldTypesRegistryMock:Components.FieldTypes.IFieldTypesRegistry;
    var notificationServiceMock:Services.INotificationService;
    var localizationServiceMock:Services.ILocalizationService;

    beforeEach(function () {
        namingConventionsServiceMock = new Mocks.NamingConventionsServiceMock();
        fieldTypesRegistryMock = new Mocks.FieldTypesRegistryMock();
        notificationServiceMock = new Mocks.NotificationServiceMock();
        localizationServiceMock = new Mocks.LocalizationServiceMock();

        systemUnderTest = new Services.EntityModelMapperService(namingConventionsServiceMock, fieldTypesRegistryMock, notificationServiceMock, localizationServiceMock);
    });

    it('should correctly map \'entity model\' to \'metadata model\'', function () {
        //Arrange
        var entity = new Models.Entity('test');
        var entityName = 'Name of entity';
        entity.Data['EntityName'] = entityName;
        var entityDescription = 'Description of entity';
        entity.Data['EntityDescription'] = entityDescription;
        var iconClass = 'IconClass';
        entity.Data['IconClassName'] = {Value: '__icon__' + iconClass};
        var iconColor = 'IconColor';
        entity.Data['IconColorHex'] = {Value: '__color__' + iconColor};

        //Act
        var result = systemUnderTest.MapEntityToEntityMetadataModel(entity);

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

    it('should correctly map \'field models\' to \'entity models\'', function () {
        //Arrange
        var mockField = new Mocks.FieldTypeMock();
        var fieldMetadataName = 'TestField';
        var fieldMetadataSystemName = 'TestFieldSystemName';
        var fieldMetadataDescription = 'TestFieldDescription';
        var testMetadata = new Models.FieldMetadata(fieldMetadataName);
        testMetadata.FieldSystemName = fieldMetadataSystemName;
        testMetadata.FieldDescription = fieldMetadataDescription;

        var specialPropertyName = 'Special';
        var specialPropertyValue = 'SpecialValue';
        testMetadata.FieldSpecialProperties = [specialPropertyName];
        testMetadata[specialPropertyName] = specialPropertyValue;

        var additionalPropertyName = 'Additional';
        var additionalPropertyValue = 'AdditionalValue';
        testMetadata.MapAdditionalProperties = function (entity:Models.Entity) {
            entity.Data[additionalPropertyName] = additionalPropertyValue;
        };

        //Act
        var fields = [testMetadata, testMetadata, testMetadata];
        var result = systemUnderTest.MapFieldsMetadataToEntityModels(fields);

        //Assert
        expect(result).not.toEqual(null);
        expect(result.length).toEqual(3);
        var firstFieldEntity = result[0];
        expect(firstFieldEntity.EntitySystemName).toEqual(fieldMetadataSystemName);
        expect(firstFieldEntity.Data['FieldTypeName'].Text).toEqual(mockField.FieldName);
        expect(firstFieldEntity.Data['FieldTypeName'].Value).toEqual(mockField.FieldName);
        expect(firstFieldEntity.Data['FieldDescription']).toEqual(fieldMetadataDescription);
        expect(firstFieldEntity.Data[specialPropertyName]).toEqual(specialPropertyValue);
        expect(firstFieldEntity.Data[additionalPropertyName]).toEqual(additionalPropertyValue);
    });

    it('should correctly map \'entity model\' to \'field model\'', function () {
        //Arrange
        var getRegistryFieldMethodMock:any = fieldTypesRegistryMock.GetFieldType;
        var entitySystemName = 'EntitySystemName';
        var entity = new Models.Entity(entitySystemName);
        var fieldTypeName = 'FieldTypeName';
        entity.Data['FieldTypeName'] = new Models.SelectFieldOptionMetadata(fieldTypeName, null);
        var fieldDescription = 'FieldDescription';
        entity.Data['FieldDescription'] = fieldDescription;
        var required = true;
        entity.Data['Required'] = required;
        var specialValue = 'SpecialValue';
        entity.Data['Special'] = specialValue;

        //Act
        var result = systemUnderTest.MapEntityModelToFieldMetadata(entity);

        //Assert
        expect(getRegistryFieldMethodMock.calls.first().args[0]).toEqual(fieldTypeName);
        expect(result).not.toEqual(null);
        expect(result.FieldDescription).toEqual(fieldDescription);
        expect(result.Required).toEqual(required);
        expect(result.FieldSystemName).toEqual('#MockFieldName'); //From FieldTypeMock
        expect(result['Additional']).toEqual('AdditionalValue'); //From FieldTypeMock
        expect(result['Special']).toEqual(specialValue);
    });

    it('should notify user when non-registered field is used', function () {
        //Arrange
        var getRegistryFieldMethodMock:any = fieldTypesRegistryMock.GetFieldType;
        var notifyCallsMock:any = notificationServiceMock.NotifyMessage;
        var entitySystemName = 'EntitySystemName';
        var entity = new Models.Entity(entitySystemName);
        var fieldTypeName = 'UnknownTypeName';
        entity.Data['FieldTypeName'] = new Models.SelectFieldOptionMetadata(fieldTypeName, null);

        //Act
        var result = systemUnderTest.MapEntityModelToFieldMetadata(entity);

        //Assert
        expect(getRegistryFieldMethodMock.calls.first().args[0]).toEqual(fieldTypeName);
        expect(notifyCallsMock.calls.first().args[0]).toEqual('#NonExistingFieldType');
        expect(result).toEqual(null);
    });

    it('should be able to deserialize metadata JSON object to \'metadata model\'', function () {
        //Arrange
        var getRegistryFieldMethodMock:any = fieldTypesRegistryMock.GetFieldType;
        var json = {
            "EntityName": "TestMetadata",
            "EntityDescription": "TestMetadata",
            "EntitySystemName": "test_metadata",
            "IconClassName": "icon",
            "IconColorHex": "#hex",
            "Id": "test_metadata",
            "CreatedDate": "2014-12-01T12:00:00.000Z",
            "ModifiedDate": "2014-12-12T12:00:00.000Z",
            "CustomProperty": "CustomValue",
            "Fields": [
                {
                    "FieldSpecialProperties": [
                        "Special"
                    ],
                    "FieldTypeName": "Mock",
                    "Configuration": null,
                    "FieldName": "TestField",
                    "Required": true,
                    "DisplayInListName": true,
                    "RegularExpression": "",
                    "MaxLength": 50,
                    "FieldSystemName": "mock"
                }
            ]
        };

        //Act
        var result = systemUnderTest.DeserializeEntityMetadataModel(json);

        //Assert
        expect(result).not.toEqual(null);
        expect(result.EntityName).toEqual(json.EntityName);
        expect(result.EntityDescription).toEqual(json.EntityDescription);
        expect(result.EntitySystemName).toEqual(json.EntitySystemName);
        expect(result.IconClassName).toEqual(json.IconClassName);
        expect(result.IconColorHex).toEqual(json.IconColorHex);
        expect(result.Id).toEqual(json.Id);
        expect(result.CreatedDate).toEqual(json.CreatedDate);
        expect(result.ModifiedDate).toEqual(json.ModifiedDate);
        expect(result['CustomProperty']).toEqual(json.CustomProperty);

        expect(result.Fields.length).toEqual(1);
        expect(getRegistryFieldMethodMock.calls.first().args[0]).toEqual(json.Fields[0].FieldTypeName);
        var firstField:any = result.Fields[0];
        expect(firstField.MaxLength).toEqual(json.Fields[0].MaxLength);
        expect(firstField.FieldSystemName).toEqual(json.Fields[0].FieldSystemName);
        expect(firstField.Required).toEqual(json.Fields[0].Required);
    });

    it('should be able to deserialize entity JSON object to \'entity model\'', function () {
        //Arrange
        var json = {
            "ErrorFields": [],
            "Id": 128,
            "CreatedDate": 1417435200000,
            "ModifiedDate": 1418385600000,
            "EntitySystemName": "test_metadata",
            "Data": {
                "option": {
                    "Value": "Value",
                    "Text": "Text"
                },
                "number": "40",
                "description": "Description",
                "bool": true
            }
        };

        //Act
        var result = systemUnderTest.DeserializeEntityModel(json);

        //Assert
        expect(result).not.toEqual(null);
        expect(result.Id).toEqual(json.Id);
        expect(result.CreatedDate).toEqual(json.CreatedDate);
        expect(result.ModifiedDate).toEqual(json.ModifiedDate);
        expect(result.EntitySystemName).toEqual(json.EntitySystemName);
        expect(result.Data).toEqual(json.Data);
    });

    it('should be able to clone \'entity model\'', function () {
        //Arrange
        var entity = new Models.Entity('testEntity');
        entity.EntitySystemName = 'systemName';
        entity.Id = 12;
        entity.CreatedDate = 1417435200000;
        entity.ModifiedDate = 1418385600000;
        entity.Data = {a: 'a'};

        //Act
        var result = systemUnderTest.CloneEntityModel(entity);

        //Assert
        expect(result).not.toEqual(null);
        expect(result).toEqual(entity);
        expect(result).not.toBe(entity);
        expect(result.Data).toEqual(entity.Data);
        expect(result.Data).not.toBe(entity.Data);
    });
});
