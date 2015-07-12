/// <reference path="../base/baseViewController.ts" />
/// <reference path="../../data/createEntityFormFields.ts" />
/// <reference path="../../models/core/entityModel.ts" />
/// <reference path="../../models/core/entityMetadataModel.ts" />
/// <reference path="../../interfaces/localization/IResources.ts" />
/// <reference path="../../interfaces/services/repository/IEntityRepositoryService.ts" />
/// <reference path="../../interfaces/services/localization/ILocalizationService.ts" />
/// <reference path="../../interfaces/services/mapping/IEntityModelMapperService.ts" />
/// <reference path="../../interfaces/services/system/IRedirectService.ts" />
/// <reference path="../../../static/loadingType.ts" />
/// <reference path="../../../static/notificationSeverity.ts" />

//Controllers for entity metadata form (creating new entity type)
module Controllers {
    'use strict';

    export class EntityMetadataFormController extends BaseViewController {
        //@ngInject
        constructor($scope:any,
                    MessagingService:Services.IMessagingService,
                    NotificationService:Services.INotificationService,
                    QueueService:Services.IQueueService,
                    StateService:Services.IStateService,
                    private EntityRepositoryService:Services.IEntityRepositoryService,
                    private LocalizationService:Services.ILocalizationService,
                    private EntityModelMapperService:Services.IEntityModelMapperService,
                    private RedirectService:Services.IRedirectService) {
            super($scope, Static.ControllerArea.Metadata, MessagingService, NotificationService, QueueService, StateService);
            this.Initialize();
        }

        public Entity:Models.Entity;
        public EntityMetadata:Models.EntityMetadata;
        public SubmitButtonText:string;
        public FormHeaderIcons:any[];
        public FormHeader:string;

        public SubmitForm():void {
            var entityMetadata:Models.EntityMetadata = this.EntityModelMapperService.MapEntityToEntityMetadataModel(this.Entity);
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.EntitySchemaSubmit);
            this.EntityRepositoryService.SaveEntityMetadata(entityMetadata, this.SaveEntityMetadataCompleted.bind(this));
        }

        private Initialize():void {
            this.FormHeaderIcons = [];
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.EntitySchemaData);
            this.CreateEntityMetadata();
        }

        private CreateEntityMetadata():void {
            var entityCreateData:Models.Entity = new Models.Entity(null);
            var entityCreateMetadata:Models.EntityMetadata = Data.CreateEntityFormFields.GetData();
            this.CreateEntityMetadataCompleted(entityCreateData, entityCreateMetadata);
        }

        private CreateEntityMetadataCompleted(entityCreateData:Models.Entity, entityCreateMetadata:Models.EntityMetadata):void {
            this.Entity = entityCreateData;
            this.EntityMetadata = entityCreateMetadata;
            this.Entity.ValidateAllFields(entityCreateMetadata);
            this.FormHeader = this.LocalizationService.Resources.CreateNewEntity;
            this.SubmitButtonText = this.LocalizationService.Resources.Create;
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.EntitySchemaData);
        }

        private SaveEntityMetadataCompleted(savedMetadata:Models.EntityMetadata, errorsModel:any):void {
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.EntitySchemaSubmit);
            if (errorsModel == null) {
                this.QueueService.Queues.NextPage.Notifications.add(
                    this.LocalizationService.Resources.MetadataCreatedSuccess, Static.NotificationSeverity.Success);
                this.MessagingService.Messages.Metadata.Created.publish(savedMetadata);
                this.RedirectService.RedirectToEditEntitySchema(savedMetadata.EntitySystemName);
            } else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }
    }
}
