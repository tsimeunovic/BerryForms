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

//Controller for entity type fields list
module Controllers {
    'use strict';

    export class FieldMetadataListController extends BaseListController {
        //@ngInject
        constructor($scope:any,
                    $routeParams:any,
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
            super($scope, Static.ControllerArea.Metadata, MessagingService, NotificationService, QueueService, StateService);
            this.EntityName = $routeParams[Static.RouteParams.EntityName];
            this.Initialize();
        }

        public FieldType:string;
        public EntityList:Models.Entity[];
        public ListItemMetadata:Models.EntityMetadata;
        public ListHeaderIcons:any[];
        public EmptyListMessage:string;
        public ListHeader:string;

        private EntityName:string;

        public SaveEntityMetadata(entityMetadata:Models.EntityMetadata):void {
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.FieldSchemaSubmit);
            this.EntityRepositoryService.SaveEntityMetadata(entityMetadata, this.SaveEntityMetadataCompleted.bind(this));
        }

        public ListRecordEdit(fieldEntity:Models.Entity):void {
            this.DomManipulationService.ScrollToTop();
            this.FieldType = fieldEntity.Data.FieldTypeName.Value;
            var fieldEditMetadata:Models.EntityMetadata = Data.CreateFieldFormFields.GetData(this.FieldType, true);
            this.MessagingService.Messages.Form.DisplayItem.publish(fieldEntity, fieldEditMetadata);
        }

        public ListRecordCreate():void {
            var fieldCreateData:Models.Entity = new Models.Entity(null);
            var fieldCreateMetadata:Models.EntityMetadata = Data.CreateFieldFormFields.GetData(null);
            this.MessagingService.Messages.Form.DisplayItem.publish(fieldCreateData, fieldCreateMetadata);
        }

        public ListRecordDelete(fieldEntity:Models.Entity):void {
            var _this:FieldMetadataListController = this;
            this.DialogService.CreateConfirmationDialog(
                [this.LocalizationService.Resources.DoYouReallyWantToDeleteMetadataField],
                function (confirmationResult:boolean):void {
                    if (!confirmationResult) {
                        return;
                    }

                    var entityMetadata:Models.EntityMetadata = _this.OriginalMetadata;
                    var fieldMetadataPredicate:(fm:Models.FieldMetadata) => boolean = function (fm:Models.FieldMetadata):boolean {
                        return fm.FieldSystemName === fieldEntity.EntitySystemName;
                    };
                    var fieldMetadata:Models.FieldMetadata = entityMetadata.Fields.single(fieldMetadataPredicate);
                    if (fieldMetadata) {
                        entityMetadata.Fields.remove(fieldMetadata);
                        _this.SaveEntityMetadata(entityMetadata);
                    }
                });
        }

        private Initialize():void {
            this.EntityList = [];
            this.ListHeaderIcons = [];
            this.SaveChangesHandler = this.SaveEntityMetadata.bind(this);

            if (this.EntityName) {
                //Existing schema
                this.ListItemMetadata = Data.CreateFieldFormFields.GetData(null);
                this.AddSubscription(this.MessagingService.Messages.Metadata.Modified.subscribe(this.LoadEntityMetadata.bind(this)));
                this.AddSubscription(this.MessagingService.Messages.Metadata.Modified.subscribe(this.MetadataChangedHandler.bind(this)));
                this.LoadEntityMetadata();
            } else {
                //Creation of new schema
                this.EmptyListMessage = this.LocalizationService.Resources.NoFieldsInNewEntity;
                this.ListHeader = this.LocalizationService.Resources.ListOfEntityFields;
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

            this.OriginalMetadata = metadata;
            this.EntityList = this.EntityModelMapperService.MapFieldsMetadataToEntityModels(metadata.Fields);
            this.EmptyListMessage = this.LocalizationService.Resources.NoFieldsInEntity.format([metadata.EntityName]);
            this.ListHeader = this.LocalizationService.Resources.ListOfEntityFields;
            this.ListHeaderIcons = [
                {
                    Icon: 'asterisk',
                    Action: this.ListRecordCreate.bind(this),
                    Tooltip: this.LocalizationService.Resources.CreateNewField
                }
            ];
            if (metadata.Fields.length) {
                this.ListHeaderIcons.push({
                    Icon: 'th-list',
                    Action: this.RedirectToEntityList.bind(this),
                    Tooltip: this.LocalizationService.Resources.ShowListOf.format([metadata.EntityName])
                });
            }

            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.FieldListMetadata);
        }

        private SaveEntityMetadataCompleted(savedMetadata:Models.EntityMetadata, errorsModel:any):void {
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.FieldSchemaSubmit);

            if (errorsModel === null) {
                this.MessagingService.Messages.Metadata.Modified.publish(savedMetadata);
                var savedMessage:string = this.LocalizationService.Resources.MetadataSavedSuccess;
                this.NotificationService.NotifyMessage(savedMessage, Static.NotificationSeverity.Success);
            } else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }

        private MetadataChangedHandler(savedMetadata:Models.EntityMetadata):void {
            if (this.OriginalMetadata.EntitySystemName !== savedMetadata.EntitySystemName) {
                return;
            }
            this.LoadEntityMetadataCompleted(savedMetadata);
        }

        private RedirectToEntityList():void {
            this.RedirectService.RedirectToCreateEntity(this.OriginalMetadata.EntitySystemName);
        }
    }
}
