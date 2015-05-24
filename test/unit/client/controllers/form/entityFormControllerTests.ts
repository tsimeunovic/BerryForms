/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/scopeMock.ts" />
/// <reference path="../../../mocks/messagingServiceMock.ts" />
/// <reference path="../../../mocks/notificationServiceMock.ts" />
/// <reference path="../../../mocks/queueServiceMock.ts" />
/// <reference path="../../../mocks/stateServiceMock.ts" />
/// <reference path="../../../mocks/entityRepositoryServiceMock.ts" />
/// <reference path="../../../mocks/entityMetadataListCacheServiceMock.ts" />
/// <reference path="../../../mocks/entityModelMapperServiceMock.ts" />
/// <reference path="../../../mocks/entityListCacheServiceMock.ts" />
/// <reference path="../../../mocks/localizationServiceMock.ts" />
/// <reference path="../../../mocks/redirectServiceMock.ts" />
/// <reference path="../../../mocks/dialogServiceMock.ts" />
/// <reference path="../../../mocks/domManipulationServiceMock.ts" />
/// <reference path="../../../../../client/angular/controllers/form/entityFormController.ts" />

'use strict';

describe('Controller: EntityFormController', function ():void {
    var scopeMock:any;
    var routeParams:any;
    var messagingServiceMock:Mocks.MessagingServiceMock;
    var notificationServiceMock:Mocks.NotificationServiceMock;
    var queueServiceMock:Mocks.QueueServiceMock;
    var stateServiceMock:Mocks.StateServiceMock;
    var entityRepositoryServiceMock:Mocks.EntityRepositoryServiceMock;
    var entityMetadataListCacheServiceMock:Mocks.EntityMetadataListCacheServiceMock;
    var entityModelMapperServiceMock:Mocks.EntityModelMapperServiceMock;
    var entityListCacheServiceMock:Mocks.EntityListCacheServiceMock;
    var localizationServiceMock:Mocks.LocalizationServiceMock;
    var redirectServiceMock:Mocks.RedirectServiceMock;
    var dialogServiceMock:Mocks.DialogServiceMock;
    var domManipulationServiceMock:Mocks.DomManipulationServiceMock;
    var systemUnderTest:Controllers.EntityFormController;

    //Helper methods
    var createEntityFormController:() => void = function ():void {
        systemUnderTest = new Controllers.EntityFormController(
            scopeMock,
            routeParams,
            messagingServiceMock,
            notificationServiceMock,
            queueServiceMock,
            stateServiceMock,
            entityRepositoryServiceMock,
            entityMetadataListCacheServiceMock,
            entityModelMapperServiceMock,
            entityListCacheServiceMock,
            localizationServiceMock,
            redirectServiceMock,
            dialogServiceMock,
            domManipulationServiceMock);
    };

    beforeEach(function ():void {
        scopeMock = new Mocks.ScopeMock();
        routeParams = {'_entityName': 'MockEntity', '_entityId': null, '_pageNumber': null};
        messagingServiceMock = new Mocks.MessagingServiceMock();
        notificationServiceMock = new Mocks.NotificationServiceMock();
        queueServiceMock = new Mocks.QueueServiceMock();
        stateServiceMock = new Mocks.StateServiceMock();
        entityRepositoryServiceMock = new Mocks.EntityRepositoryServiceMock();
        entityMetadataListCacheServiceMock = new Mocks.EntityMetadataListCacheServiceMock();
        entityModelMapperServiceMock = new Mocks.EntityModelMapperServiceMock();
        entityListCacheServiceMock = new Mocks.EntityListCacheServiceMock();
        localizationServiceMock = new Mocks.LocalizationServiceMock();
        redirectServiceMock = new Mocks.RedirectServiceMock();
        dialogServiceMock = new Mocks.DialogServiceMock();
        domManipulationServiceMock = new Mocks.DomManipulationServiceMock();
        createEntityFormController();
    });

    it('should retrieve metadata from cache for page with new entity form', function ():void {
        //Arrange
        var getEntityMetadataSpy:any = entityMetadataListCacheServiceMock.LoadEntityMetadataFromCache;
        var loadEntitySpy:any = entityRepositoryServiceMock.LoadEntity;

        //Act
        //Assert
        expect(loadEntitySpy.calls.any()).toEqual(false);
        expect(getEntityMetadataSpy.calls.any()).toEqual(true);
        expect(getEntityMetadataSpy.calls.first().args[0]).toEqual('MockEntity');
        expect(scopeMock.SubmitButtonText).toEqual('#Create');
        expect(scopeMock.FormHeader).toEqual('#CreateNewRecord');
        expect(scopeMock.FormHeaderIcons.length).toEqual(1);
    });

    it('should redirect to edit entity scheme when metadata contains no fields', function ():void {
        //Arrange
        var redirectToEditSpy:any = redirectServiceMock.RedirectToEditEntitySchema;
        routeParams = {'_entityName': 'MockEntity', '_entityId': 12, '_pageNumber': null};

        //Act
        createEntityFormController();

        //Assert
        expect(redirectToEditSpy.calls.any()).toEqual(true);
        expect(redirectToEditSpy.calls.first().args[0]).toEqual('MockEntity');
    });

    it('should retrieve metadata from cache and load entity from repository for page with edit entity', function ():void {
        //Arrange
        var getEntityMetadataSpy:any = entityMetadataListCacheServiceMock.LoadEntityMetadataFromCache;
        var loadEntitySpy:any = entityRepositoryServiceMock.LoadEntity;
        var cloneEntityMock:any = entityModelMapperServiceMock.CloneEntityModel;
        var entity:Models.Entity = new Models.Entity('MockEntity');
        entity.Data = {a: 1, b: 2};
        entityRepositoryServiceMock.AddResponse('LoadEntity', entity, null);
        routeParams = {'_entityName': 'MockEntity', '_entityId': 12, '_pageNumber': null};
        stateServiceMock.SetEditedEntity(null);

        //Act
        createEntityFormController();

        //Assert
        expect(loadEntitySpy.calls.any()).toEqual(true);
        expect(loadEntitySpy.calls.first().args[0]).toEqual('MockEntity');
        expect(loadEntitySpy.calls.first().args[1]).toEqual(12);
        expect(getEntityMetadataSpy.calls.any()).toEqual(true);
        expect(getEntityMetadataSpy.calls.first().args[0]).toEqual('MockEntity');
        expect(cloneEntityMock.calls.any()).toEqual(true);
        expect(scopeMock.SubmitButtonText).toEqual('#Update');
        expect(scopeMock.FormHeader).toEqual('#UpdateExistingRecord');
        expect(scopeMock.FormHeaderIcons.length).toEqual(1);
        expect(scopeMock.OriginalEntity).toBe(entity);
    });

    it('should notify user when entity cannot be successfully loaded', function ():void {
        //Arrange
        routeParams = {'_entityName': 'MockEntity', '_entityId': 12, '_pageNumber': null};
        var errorModel:any = {Type: 'Client'};
        entityRepositoryServiceMock.AddResponse('LoadEntity', null, errorModel);
        var handleErrorsModelSpy:any = notificationServiceMock.HandleErrorsModel;
        stateServiceMock.SetEditedEntity(null);

        //Act
        createEntityFormController();

        //Assert
        expect(handleErrorsModelSpy.calls.any()).toEqual(true);
        expect(handleErrorsModelSpy.calls.first().args[0]).toBe(errorModel);
    });

    it('should check state service for edited entity before loading it from repository', function ():void {
        //Arrange
        var getEditedEntitySpy:any = stateServiceMock.GetEditedEntity;
        var editedEntity:Models.Entity = new Models.Entity('EditedEntity');
        stateServiceMock.SetEditedEntity(editedEntity);
        routeParams = {'_entityName': 'MockEntity', '_entityId': 12, '_pageNumber': null};

        //Act
        createEntityFormController();

        //Assert
        expect(getEditedEntitySpy.calls.any()).toEqual(true);
        expect(scopeMock.OriginalEntity).toBe(editedEntity);
    });

    it('should call entity repository and create new entity when new entity form is submitted', function ():void {
        //Arrange
        var savingEntity:Models.Entity = new Models.Entity('SavingEntity');
        scopeMock.Entity = savingEntity;
        scopeMock.OriginalEntity = savingEntity;
        var createEntityMessageSpy:any = messagingServiceMock.Messages.Entity.Created.publish;
        var notifyUserSpy:any = notificationServiceMock.NotifyMessage;
        var saveEntitySpy:any = entityRepositoryServiceMock.SaveEntity;

        //Act
        scopeMock.SubmitForm();

        //Assert
        expect(saveEntitySpy.calls.any()).toEqual(true);
        expect(saveEntitySpy.calls.first().args[0]).toBe(savingEntity);
        expect(createEntityMessageSpy.calls.any()).toEqual(true);
        expect(notifyUserSpy.calls.any()).toEqual(true);
        expect(notifyUserSpy.calls.first().args[0]).toEqual('#EntityCreatedSuccess');
        expect(scopeMock.OriginalEntity).not.toEqual(null);
        expect(scopeMock.OriginalEntity.EntitySystemName).toEqual('MockEntity');
    });

    it('should call entity repository and redirect to create new entity form when existing entity form is submitted', function ():void {
        //Arrange
        var updatingEntity:Models.Entity = new Models.Entity('UpdatingEntity');
        scopeMock.Entity = updatingEntity;
        scopeMock.OriginalEntity = updatingEntity;
        var modifiedEntityMessageSpy:any = messagingServiceMock.Messages.Entity.Modified.publish;
        var queueUserNotificationSpy:any = queueServiceMock.Queues.NextPage.Notifications.add;
        routeParams = {'_entityName': 'MockEntity', '_entityId': 12, '_pageNumber': null};
        var redirectToEntityPageSpy:any = redirectServiceMock.RedirectToEntityPage;
        var saveEntitySpy:any = entityRepositoryServiceMock.SaveEntity;
        var savedEntity:Models.Entity = new Models.Entity('SavedEntity');
        savedEntity.CreatedDate = 100;
        savedEntity.ModifiedDate = 200;
        entityRepositoryServiceMock.AddResponse('SaveEntity', savedEntity, null);

        //Act
        scopeMock.SubmitForm();

        //Assert
        expect(saveEntitySpy.calls.any()).toEqual(true);
        expect(saveEntitySpy.calls.first().args[0]).toBe(updatingEntity);
        expect(modifiedEntityMessageSpy.calls.any()).toEqual(true);
        expect(queueUserNotificationSpy.calls.any()).toEqual(true);
        expect(queueUserNotificationSpy.calls.first().args[0]).toEqual('#EntityModifiedSuccess');
        expect(redirectToEntityPageSpy.calls.any()).toEqual(true);
        expect(redirectToEntityPageSpy.calls.first().args[0]).toEqual('MockEntity');
        expect(redirectToEntityPageSpy.calls.first().args[1]).toEqual(null);
        expect(redirectToEntityPageSpy.calls.first().args[2]).toEqual(1);
    });

    it('should notify user about errors during entity saving', function ():any {
        //Arrange
        var handleErrorsModelSpy:any = notificationServiceMock.HandleErrorsModel;
        var errorModel:any = {Type: 'Client'};
        entityRepositoryServiceMock.AddResponse('SaveEntity', null, errorModel);

        //Act
        scopeMock.SubmitForm();

        //Assert
        expect(handleErrorsModelSpy.calls.any()).toEqual(true);
        expect(handleErrorsModelSpy.calls.first().args[0]).toBe(errorModel);
    });
});
