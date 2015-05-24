/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/scopeMock.ts" />
/// <reference path="../../../mocks/messagingServiceMock.ts" />
/// <reference path="../../../mocks/notificationServiceMock.ts" />
/// <reference path="../../../mocks/queueServiceMock.ts" />
/// <reference path="../../../mocks/stateServiceMock.ts" />
/// <reference path="../../../mocks/entityMetadataListCacheServiceMock.ts" />
/// <reference path="../../../mocks/localizationServiceMock.ts" />
/// <reference path="../../../mocks/redirectServiceMock.ts" />
/// <reference path="../../../mocks/dialogServiceMock.ts" />
/// <reference path="../../../mocks/domManipulationServiceMock.ts" />
/// <reference path="../../../mocks/entityModelMapperServiceMock.ts" />
/// <reference path="../../../mocks/entityRepositoryServiceMock.ts" />
/// <reference path="../../../../../client/angular/controllers/list/fieldMetadataListController.ts" />

'use strict';
var _global:any = this;
var OriginalServices:any;

describe('Controller: FieldMetadataListController', function ():void {
    var scopeMock:any;
    var routeParams:any;
    var messagingServiceMock:Mocks.MessagingServiceMock;
    var notificationServiceMock:Mocks.NotificationServiceMock;
    var queueServiceMock:Mocks.QueueServiceMock;
    var stateServiceMock:Mocks.StateServiceMock;
    var entityMetadataListCacheServiceMock:Mocks.EntityMetadataListCacheServiceMock;
    var localizationServiceMock:Mocks.LocalizationServiceMock;
    var redirectServiceMock:Mocks.RedirectServiceMock;
    var entityModelMapperServiceMock:Mocks.EntityModelMapperServiceMock;
    var dialogServiceMock:Mocks.DialogServiceMock;
    var domManipulationServiceMock:Mocks.DomManipulationServiceMock;
    var entityRepositoryServiceMock:Mocks.EntityRepositoryServiceMock;
    var systemUnderTest:Controllers.FieldMetadataListController;

    //Helper methods
    var createFieldMetadataListController:() => void = function ():void {
        systemUnderTest = new Controllers.FieldMetadataListController(
            scopeMock,
            routeParams,
            messagingServiceMock,
            notificationServiceMock,
            queueServiceMock,
            stateServiceMock,
            entityMetadataListCacheServiceMock,
            localizationServiceMock,
            redirectServiceMock,
            entityModelMapperServiceMock,
            dialogServiceMock,
            domManipulationServiceMock,
            entityRepositoryServiceMock);
    };

    beforeEach(function ():void {
        scopeMock = new Mocks.ScopeMock();
        routeParams = {'_entityName': 'MockEntity'};
        messagingServiceMock = new Mocks.MessagingServiceMock();
        notificationServiceMock = new Mocks.NotificationServiceMock();
        queueServiceMock = new Mocks.QueueServiceMock();
        stateServiceMock = new Mocks.StateServiceMock();
        entityMetadataListCacheServiceMock = new Mocks.EntityMetadataListCacheServiceMock();
        localizationServiceMock = new Mocks.LocalizationServiceMock();
        redirectServiceMock = new Mocks.RedirectServiceMock();
        entityModelMapperServiceMock = new Mocks.EntityModelMapperServiceMock();
        dialogServiceMock = new Mocks.DialogServiceMock();
        domManipulationServiceMock = new Mocks.DomManipulationServiceMock();
        entityRepositoryServiceMock = new Mocks.EntityRepositoryServiceMock();

        OriginalServices = _global.Services;
        _global.Services = {LocalizationService: localizationServiceMock};

        createFieldMetadataListController();
    });

    afterEach(function ():void {
        _global.Services = OriginalServices;
    });

    it('should display empty list message when new schema is being created', function ():void {
        //Arrange
        routeParams = {'_entityName': null};

        //Act
        createFieldMetadataListController();

        //Assert
        expect(scopeMock.EmptyListMessage).toEqual('#NoFieldsInNewEntity');
        expect(scopeMock.ListHeader).toEqual('#ListOfEntityFields');
    });

    it('should retrieve metadata from cache', function ():void {
        //Arrange
        var loadMetadataFromCacheSpy:any = entityMetadataListCacheServiceMock.LoadEntityMetadataFromCache;
        var mapFieldsToEntitySpy:any = entityModelMapperServiceMock.MapFieldsMetadataToEntityModels;
        var loadMetadataResponse:Models.EntityMetadata = new Models.EntityMetadata();
        loadMetadataResponse.EntityName = 'MockEntity';
        loadMetadataResponse.EntitySystemName = 'MockEntity';
        loadMetadataResponse.Fields = [
            new Models.FieldMetadata('MockFieldType'),
            new Models.FieldMetadata('MockFieldType'),
            new Models.FieldMetadata('MockFieldType')
        ];
        entityMetadataListCacheServiceMock.SetLoadEntityMetadataFromCacheResponse(loadMetadataResponse);

        //Act
        createFieldMetadataListController();

        //Assert
        expect(loadMetadataFromCacheSpy.calls.any()).toEqual(true);
        expect(loadMetadataFromCacheSpy.calls.first().args[0]).toEqual('MockEntity');
        expect(mapFieldsToEntitySpy.calls.any()).toEqual(true);
        expect(scopeMock.EntityList.length).toEqual(3);
        expect(scopeMock.ListHeader).toEqual('#ListOfEntityFields');
        expect(scopeMock.ListHeaderIcons.length).toEqual(2);
    });

    it('should notify user when metadata is saved', function ():void {
        //Arrange
        var metadata:Models.EntityMetadata = new Models.EntityMetadata();
        var saveMetadataSpy:any = entityRepositoryServiceMock.SaveEntityMetadata;
        var notificationSpy:any = notificationServiceMock.NotifyMessage;

        //Act
        scopeMock.SaveEntityMetadata(metadata);

        //Assert
        expect(saveMetadataSpy.calls.any()).toEqual(true);
        expect(saveMetadataSpy.calls.first().args[0]).toBe(metadata);
        expect(notificationSpy.calls.any()).toEqual(true);
        expect(notificationSpy.calls.first().args[0]).toEqual('#MetadataSavedSuccess');
    });

    it('should redirect to create entity page when list icon method is invoked', function ():void {
        //Arrange
        var loadMetadataResponse:Models.EntityMetadata = new Models.EntityMetadata();
        loadMetadataResponse.EntityName = 'MockEntity';
        loadMetadataResponse.EntitySystemName = 'MockEntity';
        loadMetadataResponse.Fields = [
            new Models.FieldMetadata('MockFieldType')
        ];
        entityMetadataListCacheServiceMock.SetLoadEntityMetadataFromCacheResponse(loadMetadataResponse);
        var redirectSpy:any = redirectServiceMock.RedirectToCreateEntity;

        //Act
        createFieldMetadataListController();
        scopeMock.ListHeaderIcons[1].Action();

        //Assert
        expect(redirectSpy.calls.any()).toEqual(true);
        expect(redirectSpy.calls.first().args[0]).toEqual('MockEntity');
    });

    it('should send message with form data and metadata when edit field is called', function ():void {
        //Arrange
        var scrollTopSpy:any = domManipulationServiceMock.ScrollToTop;
        var displayItemMessageSpy:any = messagingServiceMock.Messages.Form.DisplayItem.publish;
        var editFieldEntity:Models.Entity = new Models.Entity('MockFieldEntity');
        editFieldEntity.Data = {'FieldTypeName': {'Value': 'Boolean'}};

        //Act
        scopeMock.ListRecordEdit(editFieldEntity);

        //Assert
        expect(scrollTopSpy.calls.any()).toEqual(true);
        expect(displayItemMessageSpy.calls.any()).toEqual(true);
        expect(displayItemMessageSpy.calls.first().args[0]).toBe(editFieldEntity);
        expect(displayItemMessageSpy.calls.first().args[1].Fields.length).toEqual(6);
    });

    it('should send message with new field form metadata when create field is called', function ():void {
        //Arrange
        var displayItemMessageSpy:any = messagingServiceMock.Messages.Form.DisplayItem.publish;

        //Act
        scopeMock.ListHeaderIcons[0].Action();

        //Assert
        expect(displayItemMessageSpy.calls.any()).toEqual(true);
        expect(displayItemMessageSpy.calls.first().args[0].Data).toEqual({});
        expect(displayItemMessageSpy.calls.first().args[1].Fields.length).toEqual(5);
    });

    it('should create confirmation dialog when delete field is called', function ():void {
        //Arrange
        var createDialogSpy:any = dialogServiceMock.CreateConfirmationDialog;
        var saveEntityMetadataSpy:any = entityRepositoryServiceMock.SaveEntityMetadata;
        var loadMetadataResponse:Models.EntityMetadata = new Models.EntityMetadata();
        loadMetadataResponse.EntityName = 'MockEntity';
        loadMetadataResponse.EntitySystemName = 'MockEntity';
        var field1:Models.FieldMetadata = new Models.FieldMetadata('MockFieldType');
        field1.FieldSystemName = 'Field1';
        var field2:Models.FieldMetadata = new Models.FieldMetadata('MockFieldType');
        field2.FieldSystemName = 'Field2';
        loadMetadataResponse.Fields = [
            field1,
            field2
        ];
        entityMetadataListCacheServiceMock.SetLoadEntityMetadataFromCacheResponse(loadMetadataResponse);
        var deleteFieldEntity:Models.Entity = new Models.Entity('Field1');

        //Act
        createFieldMetadataListController();
        scopeMock.ListRecordDelete(deleteFieldEntity);

        //Assert
        expect(createDialogSpy.calls.any()).toEqual(true);
        expect(saveEntityMetadataSpy.calls.any()).toEqual(true);
        expect(saveEntityMetadataSpy.calls.first().args[0]).toBe(loadMetadataResponse);
        expect(loadMetadataResponse.Fields.length).toEqual(1);
    });
});
