/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/scopeMock.ts" />
/// <reference path="../../../mocks/messagingServiceMock.ts" />
/// <reference path="../../../mocks/notificationServiceMock.ts" />
/// <reference path="../../../mocks/queueServiceMock.ts" />
/// <reference path="../../../mocks/stateServiceMock.ts" />
/// <reference path="../../../mocks/entityRepositoryServiceMock.ts" />
/// <reference path="../../../mocks/entityModelMapperServiceMock.ts" />
/// <reference path="../../../mocks/localizationServiceMock.ts" />
/// <reference path="../../../mocks/redirectServiceMock.ts" />
/// <reference path="../../../../../client/angular/controllers/form/entityMetadataFormController.ts" />

'use strict';
var _global:any = this;
var OriginalServices:any;

describe('Controller: EntityMetadataFormController', function () {
    var scopeMock:any;
    var messagingServiceMock:Mocks.MessagingServiceMock;
    var notificationServiceMock:Mocks.NotificationServiceMock;
    var queueServiceMock:Mocks.QueueServiceMock;
    var stateServiceMock:Mocks.StateServiceMock;
    var entityRepositoryServiceMock:Mocks.EntityRepositoryServiceMock;
    var localizationServiceMock:Mocks.LocalizationServiceMock;
    var entityModelMapperServiceMock:Mocks.EntityModelMapperServiceMock;
    var redirectServiceMock:Mocks.RedirectServiceMock;
    var systemUnderTest:Controllers.EntityMetadataFormController;

    beforeEach(function () {
        scopeMock = new Mocks.ScopeMock();
        messagingServiceMock = new Mocks.MessagingServiceMock();
        notificationServiceMock = new Mocks.NotificationServiceMock();
        queueServiceMock = new Mocks.QueueServiceMock();
        stateServiceMock = new Mocks.StateServiceMock();
        entityRepositoryServiceMock = new Mocks.EntityRepositoryServiceMock();
        localizationServiceMock = new Mocks.LocalizationServiceMock();
        entityModelMapperServiceMock = new Mocks.EntityModelMapperServiceMock();
        redirectServiceMock = new Mocks.RedirectServiceMock();

        OriginalServices = _global.Services;
        _global.Services = {LocalizationService: localizationServiceMock};

        createEntityMetadataFormController();
    });

    afterEach(function () {
        _global.Services = OriginalServices;
    });

    //Helper methods
    var createEntityMetadataFormController = function () {
        systemUnderTest = new Controllers.EntityMetadataFormController(
            scopeMock,
            messagingServiceMock,
            notificationServiceMock,
            queueServiceMock,
            stateServiceMock,
            entityRepositoryServiceMock,
            localizationServiceMock,
            entityModelMapperServiceMock,
            redirectServiceMock);
    };

    it('should initialize form for new schema creation', function () {
        //Arrange
        //Act
        //Assert
        expect(scopeMock.FormHeaderIcons.length).toEqual(0);
        expect(scopeMock.Entity).not.toEqual(null);
        expect(scopeMock.Entity.EntitySystemName).toEqual(null);
        expect(scopeMock.Entity.Data).toEqual({});
        expect(scopeMock.EntityMetadata).not.toEqual(null);
        expect(scopeMock.EntityMetadata.Fields.length).toEqual(4);
        expect(scopeMock.FormHeader).toEqual('#CreateNewEntity');
        expect(scopeMock.SubmitButtonText).toEqual('#Create');
    });

    it('should map entity model to metadata model and save it via repository when form is submitted', function () {
        //Arrange
        var entity:Models.Entity = new Models.Entity(null);
        var savedMetadata:Models.EntityMetadata = new Models.EntityMetadata();
        savedMetadata.EntitySystemName = 'SavedEntitySystemName';
        scopeMock.Entity = entity;
        var mapEntityToMetadataSpy:any = entityModelMapperServiceMock.MapEntityToEntityMetadataModel;
        var saveEntityMetadataSpy:any = entityRepositoryServiceMock.SaveEntityMetadata;
        entityRepositoryServiceMock.AddResponse('SaveEntityMetadata', savedMetadata, null);
        var queueUserNotificationSpy:any = queueServiceMock.Queues.NextPage.Notifications.add;
        var metadataCreatedMessageSpy:any = messagingServiceMock.Messages.Metadata.Created.publish;
        var redirectToEditEntitySchemaSpy:any = redirectServiceMock.RedirectToEditEntitySchema;

        //Act
        scopeMock.SubmitForm();

        //Assert
        expect(mapEntityToMetadataSpy.calls.any()).toEqual(true);
        expect(mapEntityToMetadataSpy.calls.first().args[0]).toBe(entity);
        expect(saveEntityMetadataSpy.calls.any()).toEqual(true);
        expect(saveEntityMetadataSpy.calls.first().args[0].EntitySystemName).toEqual('MappedMetadataFromEntity');
        expect(queueUserNotificationSpy.calls.any()).toEqual(true);
        expect(queueUserNotificationSpy.calls.first().args[0]).toEqual('#MetadataCreatedSuccess');
        expect(metadataCreatedMessageSpy.calls.any()).toEqual(true);
        expect(redirectToEditEntitySchemaSpy.calls.any()).toEqual(true);
        expect(redirectToEditEntitySchemaSpy.calls.first().args[0]).toEqual('SavedEntitySystemName');
    });

    it('should notify user when metadata was not successfully saved', function () {
        //Arrange
        scopeMock.Entity = new Models.Entity(null);
        var errorModel = {Type: 'Client'};
        entityRepositoryServiceMock.AddResponse('SaveEntityMetadata', null, errorModel);
        var handleErrorsModelSpy:any = notificationServiceMock.HandleErrorsModel;

        //Act
        scopeMock.SubmitForm();

        //Assert
        expect(handleErrorsModelSpy.calls.any()).toEqual(true);
        expect(handleErrorsModelSpy.calls.first().args[0]).toBe(errorModel);
    });
});
