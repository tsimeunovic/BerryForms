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

'use strict';

//Controllers for entity metadata form (creating new entity type)
module Controllers {
    export class EntityMetadataFormController extends BaseViewController {
        public static injection():any[] {
            return [
                '$scope',
                'MessagingService',
                'NotificationService',
                'QueueService',
                'StateService',
                'EntityRepositoryService',
                'LocalizationService',
                'EntityModelMapperService',
                'RedirectService',
                EntityMetadataFormController
            ];
        }

        constructor(Scope:any,
                    MessagingService:Services.IMessagingService,
                    NotificationService:Services.INotificationService,
                    QueueService:Services.IQueueService,
                    StateService:Services.IStateService,
                    private EntityRepositoryService:Services.IEntityRepositoryService,
                    private LocalizationService:Services.ILocalizationService,
                    private EntityModelMapperService:Services.IEntityModelMapperService,
                    private RedirectService:Services.IRedirectService) {
            super(Scope, Static.ControllerArea.Metadata, MessagingService, NotificationService, QueueService, StateService);
            this.InitializeScope();
        }

        private InitializeScope():void {
            this.Scope.FormHeaderIcons = [];
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.EntitySchemaData);
            this.CreateEntityMetadata();
        }

        private CreateEntityMetadata():void {
            var entityCreateData:Models.Entity = new Models.Entity(null);
            var entityCreateMetadata:Models.EntityMetadata = Data.CreateEntityFormFields.GetData();
            this.CreateEntityMetadataCompleted(entityCreateData, entityCreateMetadata);
        }

        private CreateEntityMetadataCompleted(entityCreateData:Models.Entity, entityCreateMetadata:Models.EntityMetadata):void {
            this.Scope.Entity = entityCreateData;
            this.Scope.EntityMetadata = entityCreateMetadata;
            this.Scope.Entity.ValidateAllFields(entityCreateMetadata);
            this.Scope.FormHeader = this.LocalizationService.Resources.CreateNewEntity;
            this.Scope.SubmitButtonText = this.LocalizationService.Resources.Create;
            this.Scope.SubmitForm = this.SubmitForm.bind(this);
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.EntitySchemaData);
        }

        private SubmitForm():void {
            var entity = this.Scope.Entity;
            var entityMetadata:Models.EntityMetadata = this.EntityModelMapperService.MapEntityToEntityMetadataModel(entity);
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.EntitySchemaSubmit);
            this.EntityRepositoryService.SaveEntityMetadata(entityMetadata, this.SaveEntityMetadataCompleted.bind(this));
        }

        private SaveEntityMetadataCompleted(savedMetadata:Models.EntityMetadata, errorsModel:any):void {
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.EntitySchemaSubmit);
            if (errorsModel == null) {
                this.QueueService.Queues.NextPage.Notifications.add(this.LocalizationService.Resources.MetadataCreatedSuccess, Services.NotificationSeverity.Success);
                this.MessagingService.Messages.Metadata.Created.publish(savedMetadata);
                this.RedirectService.RedirectToEditEntitySchema(savedMetadata.EntitySystemName);
            }
            else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }
    }
}
