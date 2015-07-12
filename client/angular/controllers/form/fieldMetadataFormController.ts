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
/// <reference path="../../../static/controllerArea.ts" />
/// <reference path="../../../static/routeParams.ts" />
/// <reference path="../../../static/notificationSeverity.ts" />

//Controllers for entity fields metadata form (adding fields to existing entity type)
module Controllers {
    'use strict';

    export class FieldMetadataFormController extends BaseViewController {
        //@ngInject
        constructor($scope:any,
                    $routeParams:any,
                    MessagingService:Services.IMessagingService,
                    NotificationService:Services.INotificationService,
                    QueueService:Services.IQueueService,
                    StateService:Services.IStateService,
                    private EntityRepositoryService:Services.IEntityRepositoryService,
                    private EntityMetadataListCacheService:Services.IEntityMetadataListCacheService,
                    private LocalizationService:Services.ILocalizationService,
                    private EntityModelMapperService:Services.IEntityModelMapperService,
                    private RedirectService:Services.IRedirectService) {
            super($scope, Static.ControllerArea.Metadata, MessagingService, NotificationService, QueueService, StateService);
            this.EntityName = $routeParams[Static.RouteParams.EntityName];
            this.Initialize();
        }

        public Entity:Models.Entity;
        public OriginalEntity:Models.Entity;
        public EntityMetadata:Models.EntityMetadata;
        public OriginalMetadata:Models.EntityMetadata;
        public SubmitButtonText:string;
        public FormHeaderIcons:any[];
        public FormHeader:string;

        private EntityName:string;
        private FieldType:string;
        private FieldAdded:boolean;
        private FieldModified:boolean;

        public SaveEntityMetadata(entityMetadata:Models.EntityMetadata):void {
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.FieldSchemaSubmit);
            this.EntityRepositoryService.SaveEntityMetadata(entityMetadata, this.SaveEntityMetadataCompleted.bind(this));
        }

        public SubmitForm():void {
            var entity:Models.Entity = this.Entity;
            var fieldMetadata:Models.FieldMetadata = this.EntityModelMapperService.MapEntityModelToFieldMetadata(entity);
            var originalEntity:Models.Entity = this.OriginalEntity;
            var entityMetadata:Models.EntityMetadata = this.OriginalMetadata;

            //Check if field with same name exists
            var conflictingFieldPredicate:(fm:Models.FieldMetadata) => boolean = function (fm:Models.FieldMetadata):boolean {
                return fm.FieldSystemName === fieldMetadata.FieldSystemName;
            };
            var conflictingField:Models.FieldMetadata = entityMetadata.Fields.single(conflictingFieldPredicate);
            var systemNameChanged:boolean = originalEntity.EntitySystemName !== entity.EntitySystemName;
            var errorOccurred:boolean = !!(systemNameChanged && conflictingField);

            if (!errorOccurred) {
                if (originalEntity.EntitySystemName) {
                    //Update
                    this.FieldModified = true;
                    var existingFieldPredicate:(fm:Models.FieldMetadata) => boolean = function (fm:Models.FieldMetadata):boolean {
                        return fm.FieldSystemName === originalEntity.EntitySystemName;
                    };
                    var existingField:Models.FieldMetadata = entityMetadata.Fields.single(existingFieldPredicate);
                    errorOccurred = !existingField;

                    if (existingField && (!systemNameChanged || !conflictingField)) {
                        entityMetadata.Fields.replace(existingField, fieldMetadata);
                    }
                } else {
                    //Create
                    errorOccurred = !!conflictingField;
                    if (!conflictingField) {
                        this.FieldAdded = true;
                        entityMetadata.Fields.push(fieldMetadata);
                    }
                }
            }

            //Check for error
            if (errorOccurred) {
                var message:string = conflictingField ?
                    this.LocalizationService.Resources.FieldAlreadyExists :
                    this.LocalizationService.Resources.CouldNotUpdateField;
                this.NotificationService.NotifyMessage(message, Static.NotificationSeverity.Error);
            } else {
                this.SaveEntityMetadata(entityMetadata);
            }
        }

        private Initialize():void {
            this.FormHeaderIcons = [];
            this.AddSubscription(this.MessagingService.Messages.Form.DisplayItem.subscribe(this.DisplayItemMessageReceived.bind(this)));
            this.AddSubscription(this.MessagingService.Messages.Metadata.Modified.subscribe(this.MetadataChangedHandler.bind(this)));
            this.CreateFieldMetadata();
        }

        private CreateFieldMetadata():void {
            var fieldCreateData:Models.Entity = new Models.Entity(null);
            var fieldCreateMetadata:Models.EntityMetadata = Data.CreateFieldFormFields.GetData(null);

            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.FieldSchemaData);
            this.CreateFieldMetadataCompleted(fieldCreateData, fieldCreateMetadata);
        }

        private DisplayItemMessageReceived(message:any):void {
            this.CreateFieldMetadataCompleted(message.Data, message.Metadata);
        }

        private CreateFieldMetadataCompleted(fieldCreateData:Models.Entity, fieldCreateMetadata:Models.EntityMetadata):void {
            this.EntityMetadata = fieldCreateMetadata;
            this.OriginalEntity = fieldCreateData;
            this.Entity = this.EntityModelMapperService.CloneEntityModel(fieldCreateData);
            this.Entity.ValidateAllFields(fieldCreateMetadata);

            //Rebind on type change
            var fieldNamePredictor:(f:Models.FieldMetadata) => boolean = function (field:Models.FieldMetadata):boolean {
                return field.FieldSystemName === 'FieldTypeName';
            };
            var fieldTypeField:Models.FieldMetadata = fieldCreateMetadata.Fields.single(fieldNamePredictor);
            fieldTypeField.ValueChanged = this.FieldTypeChanged.bind(this);

            this.LoadEntityMetadata();
        }

        private LoadEntityMetadata():void {
            this.EntityMetadataListCacheService.LoadEntityMetadataFromCache(this.EntityName, this.LoadEntityMetadataCompleted.bind(this));
        }

        private LoadEntityMetadataCompleted(metadata:Models.EntityMetadata):void {
            if (!metadata) {
                //Non-existing entity
                this.RedirectService.RedirectToCreateEntitySchema();
                return;
            }

            this.OriginalMetadata = metadata;
            this.FormHeader = this.OriginalEntity.EntitySystemName ?
                this.LocalizationService.Resources.UpdateField :
                this.LocalizationService.Resources.AddNewField.format([metadata.EntityName]);
            this.SubmitButtonText = this.OriginalEntity.EntitySystemName ?
                this.LocalizationService.Resources.Update :
                this.LocalizationService.Resources.Add;

            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.FieldSchemaData);
        }

        private FieldTypeChanged(fieldType:Models.SelectFieldOptionMetadata):void {
            if (!fieldType || fieldType.Value === this.FieldType) {
                return;
            } else {
                this.FieldType = fieldType.Value;
            }

            var fieldCreateData:Models.Entity = this.Entity;
            var edit:boolean = !!this.OriginalEntity.EntitySystemName;
            var fieldCreateMetadata:Models.EntityMetadata = Data.CreateFieldFormFields.GetData(fieldType.Value, edit);

            this.CreateFieldMetadataCompleted(fieldCreateData, fieldCreateMetadata);
        }

        private SaveEntityMetadataCompleted(savedMetadata:Models.EntityMetadata, errorsModel:any):void {
            if (errorsModel === null) {
                //Notify success and continue with next field
                this.MessagingService.Messages.Metadata.Modified.publish(savedMetadata);
                var savedMessage:string = this.FieldAdded ?
                    this.LocalizationService.Resources.MetadataFieldCreatedSuccess :
                    this.LocalizationService.Resources.MetadataSavedSuccess;
                this.NotificationService.NotifyMessage(savedMessage, Static.NotificationSeverity.Success);
                this.OriginalMetadata = savedMetadata;
                if (this.FieldAdded || this.FieldModified) {
                    this.CreateFieldMetadata();
                }
            } else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }

            this.FieldAdded = false;
            this.FieldModified = false;
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.FieldSchemaSubmit);
        }

        private MetadataChangedHandler(savedMetadata:Models.EntityMetadata):void {
            if (this.OriginalMetadata.EntitySystemName !== savedMetadata.EntitySystemName) {
                return;
            }
            this.OriginalMetadata = savedMetadata;
        }
    }
}
