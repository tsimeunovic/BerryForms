/// <reference path="../base/baseViewController.ts" />
/// <reference path="../../data/createFieldFormFields.ts" />
/// <reference path="../../models/core/entityModel.ts" />
/// <reference path="../../models/core/entityMetadataModel.ts" />
/// <reference path="../../interfaces/services/repository/IEntityRepositoryService.ts" />
/// <reference path="../../interfaces/services/localization/ILocalizationService.ts" />
/// <reference path="../../interfaces/services/mapping/IEntityModelMapperService.ts" />
/// <reference path="../../interfaces/services/system/IRedirectService.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../../interfaces/services/state/IEntityMetadataListCacheService.ts" />
/// <reference path="../../interfaces/services/state/IEntityListCacheService.ts" />
/// <reference path="../../interfaces/services/interaction/IDialogService.ts" />
/// <reference path="../../interfaces/services/interaction/IDomManipulationService.ts" />
/// <reference path="../../../static/controllerArea.ts" />
/// <reference path="../../../static/routeParams.ts" />

//Controllers for entity record form (creating/editing entity record)
module Controllers {
    'use strict';

    export class EntityFormController extends BaseViewController {
        /* tslint:disable:member-ordering */
        public static injection():any[] {
            return [
                '$scope',
                '$routeParams',
                'MessagingService',
                'NotificationService',
                'QueueService',
                'StateService',
                'EntityRepositoryService',
                'EntityMetadataListCacheService',
                'EntityModelMapperService',
                'EntityListCacheService',
                'LocalizationService',
                'RedirectService',
                'DialogService',
                'DomManipulationService',
                EntityFormController
            ];
        }

        constructor(Scope:any,
                    RouteParams:any,
                    MessagingService:Services.IMessagingService,
                    NotificationService:Services.INotificationService,
                    QueueService:Services.IQueueService,
                    StateService:Services.IStateService,
                    private EntityRepositoryService:Services.IEntityRepositoryService,
                    private EntityMetadataListCacheService:Services.IEntityMetadataListCacheService,
                    private EntityModelMapperService:Services.IEntityModelMapperService,
                    private EntityListCacheService:Services.IEntityListCacheService,
                    private LocalizationService:Services.ILocalizationService,
                    private RedirectService:Services.IRedirectService,
                    private DialogService:Services.IDialogService,
                    private DomManipulationService:Services.IDomManipulationService) {
            super(Scope, Static.ControllerArea.Entity, MessagingService, NotificationService, QueueService, StateService);
            var entityName:string = RouteParams[Static.RouteParams.EntityName];
            var entityId:number = RouteParams[Static.RouteParams.EntityId];
            var pageNumber:number = RouteParams[Static.RouteParams.PageNumber] || 1;
            var pageIndex:number = pageNumber - 1;

            this.EntityName = entityName;
            this.EntityId = entityId;
            this.PageIndex = isNaN(pageIndex) ? 0 : pageIndex;

            this.InitializeScope();
        }

        private EntityName:string;
        private EntityId:number;
        private PageIndex:number;

        private InitializeScope():void {
            this.Scope.SubmitButtonText = this.EntityId ?
                this.LocalizationService.Resources.Update :
                this.LocalizationService.Resources.Create;
            this.Scope.SubmitForm = this.SubmitForm.bind(this);
            this.Scope.FormHeaderIcons = [
                {
                    Icon: 'pencil',
                    Action: this.EditEntitySchema.bind(this),
                    Tooltip: this.LocalizationService.Resources.EditSchema
                }
            ];

            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.EntityData);
            this.LoadEntityMetadata();
        }

        private EditEntitySchema():void {
            this.RedirectService.RedirectToEditEntitySchema(this.EntityName);
        }

        private LoadEntityMetadata():void {
            this.EntityMetadataListCacheService.LoadEntityMetadataFromCache(this.EntityName, this.LoadEntityMetadataCompleted.bind(this));
        }

        private LoadEntityMetadataCompleted(metadata:Models.EntityMetadata, errorsModel:any):void {
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.EntityData);
            if (errorsModel === null) {
                //Non existing or empty entity
                if (!metadata) {
                    this.RedirectService.RedirectToCreateEntitySchema();
                    return;
                }

                if (!metadata.Fields || !metadata.Fields.length) {
                    this.EditEntitySchema();
                }
                this.Scope.EntityMetadata = metadata;

                this.Scope.FormHeader = this.EntityId ?
                    this.LocalizationService.Resources.UpdateExistingRecord.format([metadata.EntityName]) :
                    this.LocalizationService.Resources.CreateNewRecord.format([metadata.EntityName]);

                this.LoadEntity();
            } else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }

        private LoadEntity():void {
            //Check for entity being created/edited
            var editedEntity:Models.Entity = this.StateService.GetEditedEntity(this.EntityName, this.EntityId);
            if (editedEntity) {
                this.LoadEntityCompleted(editedEntity, null);
                return;
            }

            //Create new or load existing
            if (this.EntityId) {
                this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.Entity);
                this.Scope.Entity = new Models.Entity(this.Scope.EntityMetadata.EntitySystemName);
                this.EntityRepositoryService.LoadEntity(this.EntityName, this.EntityId, this.LoadEntityCompleted.bind(this));
            } else {
                var newEntity:Models.Entity = new Models.Entity(this.Scope.EntityMetadata.EntitySystemName);
                this.Scope.OriginalEntity = newEntity;
                this.Scope.Entity = this.EntityModelMapperService.CloneEntityModel(newEntity);

                this.StateService.SetEditedEntity(this.Scope.Entity);
            }
        }

        private LoadEntityCompleted(entity:Models.Entity, errorsModel:any):void {
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.Entity);

            if (errorsModel === null) {
                this.Scope.OriginalEntity = entity;
                this.Scope.Entity = this.EntityModelMapperService.CloneEntityModel(entity);
                this.StateService.SetEditedEntity(this.Scope.Entity);
                this.Scope.Entity.ValidateAllFields(this.Scope.EntityMetadata);
            } else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }

        private SubmitForm():void {
            var entity:Models.Entity = this.Scope.Entity;
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.EntitySubmit);
            this.EntityRepositoryService.SaveEntity(entity, this.SaveEntityCompleted.bind(this));
        }

        private SaveEntityCompleted(savedEntity:Models.Entity, errorsModel:any):void {
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.EntitySubmit);

            if (errorsModel === null) {
                //Notify success and continue with next record
                if (savedEntity.ModifiedDate === savedEntity.CreatedDate) {
                    this.MessagingService.Messages.Entity.Created.publish(savedEntity);
                    this.NotificationService.NotifyMessage(this.LocalizationService.Resources.EntityCreatedSuccess, Services.NotificationSeverity.Success);
                    this.StateService.SetEditedEntity(null);
                    this.LoadEntity();
                } else {
                    this.MessagingService.Messages.Entity.Modified.publish(savedEntity);
                    this.QueueService.Queues.NextPage.Notifications.add(
                        this.LocalizationService.Resources.EntityModifiedSuccess, Services.NotificationSeverity.Success);
                    this.RedirectService.RedirectToEntityPage(this.EntityName, null, this.PageIndex + 1);
                }
            } else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }
    }
}
