/// <reference path="../base/baseListController.ts" />
/// <reference path="../../../extensions/arrayExtensions.ts" />
/// <reference path="../../../extensions/stringExtensions.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../../interfaces/services/system/IRedirectService.ts" />
/// <reference path="../../interfaces/services/interaction/IDialogService.ts" />
/// <reference path="../../interfaces/services/interaction/IDomManipulationService.ts" />
/// <reference path="../../interfaces/services/repository/IEntityRepositoryService.ts" />
/// <reference path="../../interfaces/services/state/IEntityMetadataListCacheService.ts" />
/// <reference path="../../interfaces/services/state/IEntityListCacheService.ts" />
/// <reference path="../../models/core/entityModel.ts" />
/// <reference path="../../../static/routeParams.ts" />
/// <reference path="../../../static/notificationSeverity.ts" />

//Controller for entity records list
module Controllers {
    'use strict';

    export class EntityListController extends BaseListController {
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
                    private DialogService:Services.IDialogService,
                    private DomManipulationService:Services.IDomManipulationService,
                    private EntityListCacheService:Services.IEntityListCacheService,
                    private EntityRepositoryService:Services.IEntityRepositoryService) {
            super($scope, Static.ControllerArea.Entity, MessagingService, NotificationService, QueueService, StateService);

            var entityName:string = $routeParams[Static.RouteParams.EntityName];
            var entityId:number = $routeParams[Static.RouteParams.EntityId];
            var pageNumber:number = $routeParams[Static.RouteParams.PageNumber] || 1;
            var pageIndex:number = pageNumber - 1;

            this.EntityName = entityName;
            this.EntityId = entityId;
            this.PageIndex = isNaN(pageIndex) ? 0 : pageIndex;

            this.Initialize();
        }

        public EntityList:Models.Entity[];
        public ListItemMetadata:Models.EntityMetadata;
        public EmptyListMessage:string;
        public ListHeader:string;
        public ListHeaderIcons:any[];
        public Paging:any;

        private EntityName:string;
        private PageIndex:number;
        private EntityId:number;

        public ListRecordEdit(entity:Models.Entity):void {
            this.DomManipulationService.ScrollToTop();
            this.MessagingService.Messages.Entity.Modify.publish(entity);
            this.RedirectService.RedirectToEntityPage(this.EntityName, entity.Id, this.PageIndex + 1);
        }

        public ListRecordCreate():void {
            this.RedirectService.RedirectToEntityPage(this.EntityName, null, this.PageIndex + 1);
        }

        public ListRecordDelete(entity:Models.Entity):void {
            var _this:EntityListController = this;
            this.DialogService.CreateConfirmationDialog(
                [this.LocalizationService.Resources.DoYouReallyWantToDeleteEntity],
                function (confirmationResult:boolean):void {
                    if (!confirmationResult) {
                        return;
                    }

                    _this.MessagingService.Messages.Entity.Delete.publish(entity);
                    _this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.EntityDelete);
                    _this.EntityRepositoryService.DeleteEntity(entity, _this.ListRecordDeleted.bind(_this));
                });
        }

        private Initialize():void {
            this.EntityList = [];
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.EntityListMetadata);
            this.LoadEntityMetadata();
        }

        private LoadEntityMetadata():void {
            this.EntityMetadataListCacheService.LoadEntityMetadataFromCache(this.EntityName, this.LoadEntityMetadataCompleted.bind(this));
        }

        private LoadEntityMetadataCompleted(metadata:Models.EntityMetadata, errorsModel:any):void {
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.EntityListMetadata);
            if (errorsModel == null) {
                if (!metadata) {
                    //Non existing or empty entity
                    this.RedirectService.RedirectToCreateEntitySchema();
                    return;
                }

                this.ListItemMetadata = metadata;
                this.EmptyListMessage = this.LocalizationService.Resources.NoRecordsOfEntity.format([metadata.EntityName]);
                this.ListHeader = this.LocalizationService.Resources.ListOfRecords.format([metadata.EntityName]);
                this.ListHeaderIcons = [
                    {
                        Icon: 'asterisk',
                        Action: this.ListRecordCreate.bind(this),
                        Tooltip: this.LocalizationService.Resources.CreateNewRecord.format([metadata.EntityName])
                    },
                    {
                        Icon: 'filter',
                        Action: this.RedirectToFilteredList.bind(this),
                        Tooltip: this.LocalizationService.Resources.ShowFilteredList
                    }
                ];

                this.LoadEntityList();
                this.AddSubscription(this.MessagingService.Messages.Cache.EntityList.Invalidated.subscribe(this.LoadEntityList.bind(this)));
                this.AddSubscription(this.MessagingService.Messages.Cache.EntityList.Changed.subscribe(this.LoadEntityList.bind(this)));
            } else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }

        private LoadEntityList():void {
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.EntityList);
            this.EntityListCacheService.LoadEntityListPage(this.EntityName, {}, this.PageIndex, this.LoadEntityListCompleted.bind(this));
        }

        private LoadEntityListCompleted(entities:Models.Entity[], query:any, pageIndex:number, totalPages:number, errorsModel:any):void {
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.EntityList);

            if (errorsModel === null) {
                this.SetPaging(pageIndex, totalPages);
                this.EntityList = entities;
            } else {
                this.SetPaging(pageIndex, 0);
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }

        private ListRecordDeleted(deletedEntity:Models.Entity, errorsModel:any):void {
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.EntityDelete);

            if (errorsModel == null) {
                this.MessagingService.Messages.Entity.Deleted.publish(deletedEntity);
                this.NotificationService.NotifyMessage(this.LocalizationService.Resources.EntityDeletedSuccess, Static.NotificationSeverity.Success);
            } else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }

        private RedirectToFilteredList():void {
            this.RedirectService.RedirectToFilteredList(this.EntityName, null, 0);
        }

        private SetPaging(pageIndex:number, totalPages:number):void {
            var _this:EntityListController = this;
            var pageNumber:number = pageIndex + 1;
            this.Paging = {
                //State
                ShowPaging: totalPages > 1 || (pageNumber > totalPages && pageNumber !== 1) || pageNumber < 0,
                CanGoFirst: pageNumber !== 1,
                CanGoPrevious: pageNumber > 1,
                CanGoNext: pageNumber < totalPages,
                CanGoLast: pageNumber !== totalPages,
                CurrentPage: pageNumber,
                SelectedPage: pageNumber,
                TotalPages: totalPages,

                //Actions
                GoSelected: function ():void {
                    _this.RedirectService.RedirectToEntityPage(_this.EntityName, _this.EntityId, _this.Paging.SelectedPage);
                },
                GoFirst: function ():void {
                    _this.RedirectService.RedirectToEntityPage(_this.EntityName, _this.EntityId, 1);
                },
                GoPrevious: function ():void {
                    _this.RedirectService.RedirectToEntityPage(_this.EntityName, _this.EntityId, pageNumber - 1);
                },
                GoNext: function ():void {
                    _this.RedirectService.RedirectToEntityPage(_this.EntityName, _this.EntityId, pageNumber + 1);
                },
                GoLast: function ():void {
                    _this.RedirectService.RedirectToEntityPage(_this.EntityName, _this.EntityId, totalPages);
                }
            };
        }
    }
}
