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
/// <reference path="../../interfaces/services/interaction/IDialogService.ts" />
/// <reference path="../../interfaces/services/interaction/IDomManipulationService.ts" />
/// <reference path="../../../static/controllerArea.ts" />
/// <reference path="../../../static/routeParams.ts" />
/// <reference path="../../../static/notificationSeverity.ts" />

//Controllers for entity fields metadata form (adding fields to existing entity type)
module Controllers {
    'use strict';

    export class FieldMetadataFormController extends BaseViewController {
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
                'LocalizationService',
                'EntityModelMapperService',
                'RedirectService',
                'DialogService',
                'DomManipulationService',
                FieldMetadataFormController
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
                    private LocalizationService:Services.ILocalizationService,
                    private EntityModelMapperService:Services.IEntityModelMapperService,
                    private RedirectService:Services.IRedirectService,
                    private DialogService:Services.IDialogService,
                    private DomManipulationService:Services.IDomManipulationService) {
            super(Scope, Static.ControllerArea.Metadata, MessagingService, NotificationService, QueueService, StateService);
            this.EntityName = RouteParams[Static.RouteParams.EntityName];
            this.InitializeScope();
        }

        private EntityName:string;

        private InitializeScope():void {
            this.Scope.FormHeaderIcons = [];
            this.Scope.SaveEntityMetadata = this.SaveEntityMetadata.bind(this);
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
            this.Scope.EntityMetadata = fieldCreateMetadata;
            this.Scope.OriginalEntity = fieldCreateData;
            this.Scope.Entity = this.EntityModelMapperService.CloneEntityModel(fieldCreateData);
            this.Scope.Entity.ValidateAllFields(fieldCreateMetadata);

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

            this.Scope.OriginalMetadata = metadata;
            this.Scope.FormHeader = this.Scope.OriginalEntity.EntitySystemName ?
                this.LocalizationService.Resources.UpdateField :
                this.LocalizationService.Resources.AddNewField.format([metadata.EntityName]);
            this.Scope.SubmitButtonText = this.Scope.OriginalEntity.EntitySystemName ?
                this.LocalizationService.Resources.Update :
                this.LocalizationService.Resources.Add;
            this.Scope.SubmitForm = this.SubmitForm.bind(this);

            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.FieldSchemaData);
        }

        private FieldTypeChanged(fieldType:Models.SelectFieldOptionMetadata):void {
            if (!fieldType || fieldType.Value === this.Scope.FieldType) {
                return;
            } else {
                this.Scope.FieldType = fieldType.Value;
            }

            var fieldCreateData:Models.Entity = this.Scope.Entity;
            var edit:boolean = !!this.Scope.OriginalEntity.EntitySystemName;
            var fieldCreateMetadata:Models.EntityMetadata = Data.CreateFieldFormFields.GetData(fieldType.Value, edit);

            this.CreateFieldMetadataCompleted(fieldCreateData, fieldCreateMetadata);
        }

        private SubmitForm():void {
            var entity:Models.Entity = this.Scope.Entity;
            var fieldMetadata:Models.FieldMetadata = this.EntityModelMapperService.MapEntityModelToFieldMetadata(entity);
            var originalEntity:Models.Entity = this.Scope.OriginalEntity;
            var entityMetadata:Models.EntityMetadata = this.Scope.OriginalMetadata;

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
                    this.Scope.FieldModified = true;
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
                        this.Scope.FieldAdded = true;
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

        private SaveEntityMetadata(entityMetadata:Models.EntityMetadata):void {
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.FieldSchemaSubmit);
            this.EntityRepositoryService.SaveEntityMetadata(entityMetadata, this.SaveEntityMetadataCompleted.bind(this));
        }

        private SaveEntityMetadataCompleted(savedMetadata:Models.EntityMetadata, errorsModel:any):void {
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.FieldSchemaSubmit);
            var fieldAdded:boolean = this.Scope.FieldAdded;
            var fieldModified:boolean = this.Scope.FieldModified;
            this.Scope.FieldAdded = false;
            this.Scope.FieldModified = false;

            if (errorsModel === null) {
                //Notify success and continue with next field
                this.MessagingService.Messages.Metadata.Modified.publish(savedMetadata);
                var savedMessage:string = fieldAdded ?
                    this.LocalizationService.Resources.MetadataFieldCreatedSuccess :
                    this.LocalizationService.Resources.MetadataSavedSuccess;
                this.NotificationService.NotifyMessage(savedMessage, Static.NotificationSeverity.Success);
                this.Scope.OriginalMetadata = savedMetadata;
                if (fieldAdded || fieldModified) {
                    this.CreateFieldMetadata();
                }
            } else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }

        private MetadataChangedHandler(savedMetadata:Models.EntityMetadata):void {
            if (this.Scope.OriginalMetadata.EntitySystemName !== savedMetadata.EntitySystemName) {
                return;
            }
            this.Scope.OriginalMetadata = savedMetadata;
        }
    }
}
