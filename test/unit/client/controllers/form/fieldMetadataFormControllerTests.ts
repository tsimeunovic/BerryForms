/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/scopeMock.ts" />
/// <reference path="../../../mocks/messagingServiceMock.ts" />
/// <reference path="../../../mocks/notificationServiceMock.ts" />
/// <reference path="../../../mocks/queueServiceMock.ts" />
/// <reference path="../../../mocks/stateServiceMock.ts" />
/// <reference path="../../../mocks/entityRepositoryServiceMock.ts" />
/// <reference path="../../../mocks/entityMetadataListCacheServiceMock.ts" />
/// <reference path="../../../mocks/entityModelMapperServiceMock.ts" />
/// <reference path="../../../mocks/localizationServiceMock.ts" />
/// <reference path="../../../mocks/redirectServiceMock.ts" />
/// <reference path="../../../mocks/dialogServiceMock.ts" />
/// <reference path="../../../mocks/domManipulationServiceMock.ts" />
/// <reference path="../../../../../client/angular/controllers/form/fieldMetadataFormController.ts" />

'use strict';
var _global:any = this;
var OriginalServices:any;

describe('Controller: FieldMetadataFormController', function () {
    var scopeMock:any;
    var routeParams:any;
    var messagingServiceMock:Mocks.MessagingServiceMock;
    var notificationServiceMock:Mocks.NotificationServiceMock;
    var queueServiceMock:Mocks.QueueServiceMock;
    var stateServiceMock:Mocks.StateServiceMock;
    var entityRepositoryServiceMock:Mocks.EntityRepositoryServiceMock;
    var entityMetadataListCacheServiceMock:Mocks.EntityMetadataListCacheServiceMock;
    var entityModelMapperServiceMock:Mocks.EntityModelMapperServiceMock;
    var localizationServiceMock:Mocks.LocalizationServiceMock;
    var redirectServiceMock:Mocks.RedirectServiceMock;
    var dialogServiceMock:Mocks.DialogServiceMock;
    var domManipulationServiceMock:Mocks.DomManipulationServiceMock;
    var systemUnderTest:Controllers.FieldMetadataFormController;

    beforeEach(function () {
        scopeMock = new Mocks.ScopeMock();
        routeParams = {'_entityName': 'MockEntity'};
        messagingServiceMock = new Mocks.MessagingServiceMock();
        notificationServiceMock = new Mocks.NotificationServiceMock();
        queueServiceMock = new Mocks.QueueServiceMock();
        stateServiceMock = new Mocks.StateServiceMock();
        entityRepositoryServiceMock = new Mocks.EntityRepositoryServiceMock();
        entityMetadataListCacheServiceMock = new Mocks.EntityMetadataListCacheServiceMock();
        entityModelMapperServiceMock = new Mocks.EntityModelMapperServiceMock();
        localizationServiceMock = new Mocks.LocalizationServiceMock();
        redirectServiceMock = new Mocks.RedirectServiceMock();
        dialogServiceMock = new Mocks.DialogServiceMock();
        domManipulationServiceMock = new Mocks.DomManipulationServiceMock();

        OriginalServices = _global.Services;
        _global.Services = {LocalizationService: localizationServiceMock};

        createFieldMetadataFormController();
    });

    afterEach(function () {
        _global.Services = OriginalServices;
    });

    //Helper methods
    var createFieldMetadataFormController = function () {
        systemUnderTest = new Controllers.FieldMetadataFormController(
            scopeMock,
            routeParams,
            messagingServiceMock,
            notificationServiceMock,
            queueServiceMock,
            stateServiceMock,
            entityRepositoryServiceMock,
            entityMetadataListCacheServiceMock,
            localizationServiceMock,
            entityModelMapperServiceMock,
            redirectServiceMock,
            dialogServiceMock,
            domManipulationServiceMock);
    };

    it('should load entity metadata from metadata cache', function () {
        //Arrange
        var loadEntityMetadataFromCacheSpy:any = entityMetadataListCacheServiceMock.LoadEntityMetadataFromCache;

        //Act
        //Assert
        expect(loadEntityMetadataFromCacheSpy.calls.any()).toEqual(true);
        expect(scopeMock.FormHeader).toEqual('#AddNewField');
        expect(scopeMock.SubmitButtonText).toEqual('#Add');
    });

    it('should display updates header when working with existing field', function () {
        //Arrange
        var displayItemMessageSpy:any = messagingServiceMock.Messages.Form.DisplayItem.subscribe;
        var displayItemMessageSubscribedFunction:any = displayItemMessageSpy.calls.first().args[0];
        var entity = new Models.Entity('ExistingEntity');
        var metadata = new Models.EntityMetadata();
        var field = new Models.FieldMetadata('FieldTypeName');
        field.FieldSystemName = 'FieldTypeName';
        metadata.Fields = [field];

        //Act
        displayItemMessageSubscribedFunction({Data: entity, Metadata: metadata});

        //Assert
        expect(scopeMock.FormHeader).toEqual('#UpdateField');
        expect(scopeMock.SubmitButtonText).toEqual('#Update');
    });

    it('should recreate form when type of field is changed', function () {
        //Arrange
        var displayItemMessageSpy:any = messagingServiceMock.Messages.Form.DisplayItem.subscribe;
        var displayItemMessageSubscribedFunction:any = displayItemMessageSpy.calls.first().args[0];
        var entity = new Models.Entity('ExistingEntity');
        var metadata = new Models.EntityMetadata();
        var field = new Models.FieldMetadata('FieldTypeName');
        field.FieldSystemName = 'FieldTypeName';
        metadata.Fields = [field];

        //Act
        displayItemMessageSubscribedFunction({Data: entity, Metadata: metadata});
        field.ValueChanged(new Models.SelectFieldOptionMetadata('Boolean', null), true);

        //Assert
        expect(scopeMock.EntityMetadata.Fields.length).toEqual(6);
    });

    it('should not create field when field with same name already exists', function () {
        //Arrange
        var originalMetadata:Models.EntityMetadata = new Models.EntityMetadata();
        var field = new Models.FieldMetadata('EntityModelMapperServiceMockFieldMetadata');
        field.FieldSystemName = 'EntityModelMapperServiceMockFieldMetadata';
        originalMetadata.Fields = [field];
        scopeMock.OriginalMetadata = originalMetadata;
        scopeMock.Entity = new Models.Entity('EntityModelMapperServiceMockFieldMetadata');
        var saveEntityMetadataSpy:any = entityRepositoryServiceMock.SaveEntityMetadata;
        var notifyMessageSpy:any = notificationServiceMock.NotifyMessage;

        //Act
        scopeMock.SubmitForm();

        //Assert
        expect(saveEntityMetadataSpy.calls.any()).toEqual(false);
        expect(notifyMessageSpy.calls.any()).toEqual(true);
        expect(notifyMessageSpy.calls.first().args[0]).toEqual('#FieldAlreadyExists');
    });

    it('should be able to update existing field', function () {
        //Arrange
        var originalEntity:Models.Entity = new Models.Entity('EntityModelMapperServiceMockFieldMetadata');
        scopeMock.OriginalEntity = originalEntity;
        var originalMetadata:Models.EntityMetadata = new Models.EntityMetadata();
        var field = new Models.FieldMetadata('EntityModelMapperServiceMockFieldMetadata');
        field.FieldSystemName = 'EntityModelMapperServiceMockFieldMetadata';
        originalMetadata.Fields = [field];
        scopeMock.OriginalMetadata = originalMetadata;
        scopeMock.Entity = new Models.Entity('EntityModelMapperServiceMockFieldMetadata');
        var saveEntityMetadataSpy:any = entityRepositoryServiceMock.SaveEntityMetadata;
        var notifyMessageSpy:any = notificationServiceMock.NotifyMessage;

        //Act
        scopeMock.SubmitForm();

        //Assert
        expect(saveEntityMetadataSpy.calls.any()).toEqual(true);
        expect(saveEntityMetadataSpy.calls.first().args[0].Fields.length).toEqual(1);
        expect(notifyMessageSpy.calls.any()).toEqual(true);
        expect(notifyMessageSpy.calls.first().args[0]).toEqual('#MetadataSavedSuccess');
    });

    it('should notify user and create new field form after metadata are saved', function () {
        //Arrange
        var originalMetadata:Models.EntityMetadata = new Models.EntityMetadata();
        var field = new Models.FieldMetadata('SomeFieldName');
        field.FieldSystemName = 'SomeFieldName';
        originalMetadata.Fields = [field];
        scopeMock.OriginalMetadata = originalMetadata;
        scopeMock.Entity = new Models.Entity('AnotherFieldName');
        var saveEntityMetadataSpy:any = entityRepositoryServiceMock.SaveEntityMetadata;
        var notifyMessageSpy:any = notificationServiceMock.NotifyMessage;

        //Act
        scopeMock.SubmitForm();

        //Assert
        expect(saveEntityMetadataSpy.calls.any()).toEqual(true);
        expect(saveEntityMetadataSpy.calls.first().args[0].Fields.length).toEqual(2);
        expect(notifyMessageSpy.calls.any()).toEqual(true);
        expect(notifyMessageSpy.calls.first().args[0]).toEqual('#MetadataFieldCreatedSuccess');
    });
});
