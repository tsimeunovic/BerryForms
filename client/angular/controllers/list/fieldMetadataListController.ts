/// <reference path="../base/baseListController.ts" />
/// <reference path="../../../extensions/arrayExtensions.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../../interfaces/services/state/IEntityMetadataListCacheService.ts" />
/// <reference path="../../interfaces/services/localization/ILocalizationService.ts" />
/// <reference path="../../interfaces/services/system/IRedirectService.ts" />
/// <reference path="../../interfaces/services/interaction/IDomManipulationService.ts" />
/// <reference path="../../interfaces/services/interaction/IDialogService.ts" />
/// <reference path="../../interfaces/services/repository/IEntityRepositoryService.ts" />
/// <reference path="../../models/core/entityModel.ts" />
/// <reference path="../../data/createFieldFormFields.ts" />
/// <reference path="../../../static/routeParams.ts" />
/// <reference path="../../../extensions/stringExtensions.ts" />

'use strict';

//Controller for entity type fields list
module Controllers {
    export class FieldMetadataListController extends BaseListController {
        public static injection():any[] {
            return [
                '$scope',
                '$routeParams',
                'MessagingService',
                'NotificationService',
                'QueueService',
                'StateService',
                'EntityMetadataListCacheService',
                'LocalizationService',
                'RedirectService',
                'EntityModelMapperService',
                'DialogService',
                'DomManipulationService',
                'EntityRepositoryService',
                FieldMetadataListController
            ];
        }

        constructor(Scope:any,
                    RouteParams:any,
                    MessagingService:Services.IMessagingService,
                    NotificationService:Services.INotificationService,
                    QueueService:Services.IQueueService,
                    StateService:Services.IStateService,
                    private EntityMetadataListCacheService:Services.IEntityMetadataListCacheService,
                    private LocalizationService:Services.ILocalizationService,
                    private RedirectService:Services.IRedirectService,
                    private EntityModelMapperService:Services.IEntityModelMapperService,
                    private DialogService:Services.IDialogService,
                    private DomManipulationService:Services.IDomManipulationService,
                    private EntityRepositoryService:Services.IEntityRepositoryService) {
            super(Scope, Static.ControllerArea.Metadata, MessagingService, NotificationService, QueueService, StateService);
            this.EntityName = RouteParams[Static.RouteParams.EntityName];
            this.InitializeScope();
        }

        private EntityName:string;

        private InitializeScope() {
            this.Scope.EntityList = [];
            this.Scope.ListHeaderIcons = [];

            if (this.EntityName) {
                //Existing schema
                this.Scope.ListRecordEdit = this.ListRecordEdit.bind(this);
                this.Scope.ListRecordDelete = this.ListRecordDelete.bind(this);
                this.Scope.SaveEntityMetadata = this.SaveEntityMetadata.bind(this);
                this.Scope.ListItemMetadata = Data.CreateFieldFormFields.GetData(null);

                this.AddSubscription(this.MessagingService.Messages.Metadata.Modified.subscribe(this.LoadEntityMetadata.bind(this)));
                this.AddSubscription(this.MessagingService.Messages.Metadata.Modified.subscribe(this.MetadataChangedHandler.bind(this)));
                this.LoadEntityMetadata();
            }
            else {
                //Creation of new schema
                this.Scope.EmptyListMessage = this.LocalizationService.Resources.NoFieldsInNewEntity;
                this.Scope.ListHeader = this.LocalizationService.Resources.ListOfEntityFields;
            }
        }

        private LoadEntityMetadata():void {
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.FieldListMetadata);
            this.EntityMetadataListCacheService.LoadEntityMetadataFromCache(this.EntityName, this.LoadEntityMetadataCompleted.bind(this));
        }

        private LoadEntityMetadataCompleted(metadata:Models.EntityMetadata):void {
            if (!metadata) {
                //Non-existing entity
                this.RedirectService.RedirectToCreateEntitySchema();
                return;
            }

            this.Scope.OriginalMetadata = metadata;
            this.Scope.EntityList = this.EntityModelMapperService.MapFieldsMetadataToEntityModels(metadata.Fields);
            this.Scope.EmptyListMessage = this.LocalizationService.Resources.NoFieldsInEntity.format([metadata.EntityName]);
            this.Scope.ListHeader = this.LocalizationService.Resources.ListOfEntityFields;
            this.Scope.ListHeaderIcons = [
                {
                    Icon: 'asterisk',
                    Action: this.ListRecordCreate.bind(this),
                    Tooltip: this.LocalizationService.Resources.CreateNewField
                }
            ];
            if (metadata.Fields.length) this.Scope.ListHeaderIcons.push({
                Icon: 'th-list',
                Action: this.RedirectToEntityList.bind(this),
                Tooltip: this.LocalizationService.Resources.ShowListOf.format([metadata.EntityName])
            });

            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.FieldListMetadata);
        }

        private ListRecordEdit(fieldEntity:Models.Entity):void {
            this.DomManipulationService.ScrollToTop();
            this.Scope.FieldType = fieldEntity.Data['FieldTypeName'].Value;
            var fieldEditMetadata:Models.EntityMetadata = Data.CreateFieldFormFields.GetData(this.Scope.FieldType, true);
            this.MessagingService.Messages.Form.DisplayItem.publish(fieldEntity, fieldEditMetadata);
        }

        private ListRecordCreate():void {
            var fieldCreateData:Models.Entity = new Models.Entity(null);
            var fieldCreateMetadata:Models.EntityMetadata = Data.CreateFieldFormFields.GetData(null);
            this.MessagingService.Messages.Form.DisplayItem.publish(fieldCreateData, fieldCreateMetadata);
        }

        private ListRecordDelete(fieldEntity:Models.Entity):void {
            var _this = this;
            this.DialogService.CreateConfirmationDialog([this.LocalizationService.Resources.DoYouReallyWantToDeleteMetadataField], function (confirmationResult:boolean) {
                if (!confirmationResult) return;

                var entityMetadata:Models.EntityMetadata = _this.Scope.OriginalMetadata;
                var fieldMetadataPredicate = function (fm:Models.FieldMetadata) {
                    return fm.FieldSystemName == fieldEntity.EntitySystemName;
                };
                var fieldMetadata:Models.FieldMetadata = entityMetadata.Fields.single(fieldMetadataPredicate);
                if (fieldMetadata) {
                    entityMetadata.Fields.remove(fieldMetadata);
                    _this.SaveEntityMetadata(entityMetadata);
                }
            });
        }

        private SaveEntityMetadata(entityMetadata:Models.EntityMetadata):void {
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.FieldSchemaSubmit);
            this.EntityRepositoryService.SaveEntityMetadata(entityMetadata, this.SaveEntityMetadataCompleted.bind(this));
        }

        private SaveEntityMetadataCompleted(savedMetadata:Models.EntityMetadata, errorsModel:any):void {
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.FieldSchemaSubmit);

            if (errorsModel == null) {
                this.MessagingService.Messages.Metadata.Modified.publish(savedMetadata);
                var savedMessage = this.LocalizationService.Resources.MetadataSavedSuccess;
                this.NotificationService.NotifyMessage(savedMessage, Services.NotificationSeverity.Success);
            }
            else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }

        private MetadataChangedHandler(savedMetadata:Models.EntityMetadata):void {
            if(this.Scope.OriginalMetadata.EntitySystemName != savedMetadata.EntitySystemName) return;
            this.LoadEntityMetadataCompleted(savedMetadata);
        }

        private RedirectToEntityList():void {
            this.RedirectService.RedirectToCreateEntity(this.Scope.OriginalMetadata.EntitySystemName);
        }
    }
}
