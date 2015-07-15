/// <reference path="../base/baseListController.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../../interfaces/services/state/IEntityListCacheService.ts" />
/// <reference path="../../interfaces/services/state/IEntityMetadataListCacheService.ts" />
/// <reference path="../../interfaces/services/system/IRedirectService.ts" />
/// <reference path="../../interfaces/services/localization/ILocalizationService.ts" />
/// <reference path="../../interfaces/services/mapping/IFilterConverterService.ts" />
/// <reference path="../../models/core/entityModel.ts" />
/// <reference path="../../../extensions/arrayExtensions.ts" />
/// <reference path="../../../extensions/stringExtensions.ts" />
/// <reference path="../../../extensions/objectExtensions.ts" />
/// <reference path="../../../static/routeParams.ts" />

//Controller for entity records list with filter
module Controllers {
    'use strict';

    export class EntityListWithFilterController extends BaseListController {
        //@ngInject
        constructor($scope:any,
                    $routeParams:any,
                    MessagingService:Services.IMessagingService,
                    NotificationService:Services.INotificationService,
                    QueueService:Services.IQueueService,
                    StateService:Services.IStateService,
                    private EntityListCacheService:Services.IEntityListCacheService,
                    private EntityMetadataListCacheService:Services.IEntityMetadataListCacheService,
                    private RedirectService:Services.IRedirectService,
                    private LocalizationService:Services.ILocalizationService,
                    private FilterConverterService:Services.IFilterConverterService) {
            super($scope, Static.ControllerArea.Entity, MessagingService, NotificationService, QueueService, StateService);
            var entityName:string = $routeParams[Static.RouteParams.EntityName];
            var pageNumber:number = $routeParams[Static.RouteParams.PageNumber];
            var pageIndex:number = pageNumber - 1;

            this.RouteParams = $routeParams;
            this.EntityName = entityName;
            this.PageIndex = isNaN(pageIndex) ? 0 : pageIndex;

            this.Initialize();
        }

        public Entity:Models.Entity;
        public EntityList:Models.Entity[];
        public EntityMetadata:Models.EntityMetadata;
        public FilterMetadata:Models.EntityMetadata;
        public IsFilterEmpty:boolean;
        public IsFilterCollapsed:boolean;
        public EmptyListMessage:string;
        public ListHeader:string;
        public Paging:any;

        private RouteParams:any;
        private EntityName:string;
        private PageIndex:number;
        private FilterEntity:Models.Entity;
        private DatabaseQuery:any;
        private FilterQueryString:string;

        public DoFilteredSearch():void {
            var filterQueryString:string = this.FilterConverterService.CreateFilterQueryString(this.EntityMetadata, this.FilterEntity);
            this.RedirectService.RedirectToFilteredList(this.EntityName, filterQueryString, 1);
        }

        private Initialize():void {
            this.LoadEntityMetadata();
        }

        private LoadEntityMetadata():void {
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.FilteredListMetadata);
            this.EntityMetadataListCacheService.LoadEntityMetadataFromCache(this.EntityName, this.LoadEntityMetadataCompleted.bind(this));
        }

        private LoadEntityMetadataCompleted(metadata:Models.EntityMetadata, errorsModel:any):void {
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.FilteredListMetadata);
            if (errorsModel == null) {
                if (!metadata) {
                    //Non existing or empty entity
                    this.RedirectService.RedirectToCreateEntitySchema();
                    return;
                }

                this.EntityMetadata = metadata;
                this.FilterMetadata = this.FilterConverterService.CreateFilterFormMetadataFromEntityMetadata(metadata);
                this.FilterEntity = this.FilterConverterService.ParseFilterQueryString(metadata, this.RouteParams);
                this.DatabaseQuery = this.FilterConverterService.CreateDatabaseQueryFromFilter(metadata, this.FilterEntity);
                this.FilterQueryString = this.FilterConverterService.CreateFilterQueryString(metadata, this.FilterEntity);

                this.Entity = this.FilterEntity;
                this.IsFilterEmpty = Object.isEmpty(this.FilterEntity.Data);
                this.IsFilterCollapsed = this.IsFilterEmpty;
                this.EmptyListMessage = this.LocalizationService.Resources.NoRecordsOfFilteredEntity.format([metadata.EntityName]);
                this.ListHeader = this.LocalizationService.Resources.ListOfRecords.format([metadata.EntityName]);

                this.LoadEntityList();
            } else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }

        private LoadEntityList():void {
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.EntityList);
            this.EntityListCacheService.LoadEntityListPage(this.EntityName, this.DatabaseQuery, this.PageIndex, this.LoadEntityListCompleted.bind(this));
        }

        private LoadEntityListCompleted(entities:Models.Entity[], query:any, pageIndex:number, totalPages:number, errorsModel:any):void {
            if (!Object.haveEqualData(this.DatabaseQuery, query)) {
                return;
            }
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.EntityList);

            if (errorsModel == null) {
                this.SetPaging(pageIndex, totalPages);
                this.EntityList = entities;
            } else {
                this.SetPaging(pageIndex, 0);
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }

        private SetPaging(pageIndex:number, totalPages:number):void {
            var _this:EntityListWithFilterController = this;
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
                    _this.RedirectService.RedirectToFilteredList(_this.EntityName, _this.FilterQueryString, _this.Paging.SelectedPage);
                },
                GoFirst: function ():void {
                    _this.RedirectService.RedirectToFilteredList(_this.EntityName, _this.FilterQueryString, 1);
                },
                GoPrevious: function ():void {
                    _this.RedirectService.RedirectToFilteredList(_this.EntityName, _this.FilterQueryString, pageNumber - 1);
                },
                GoNext: function ():void {
                    _this.RedirectService.RedirectToFilteredList(_this.EntityName, _this.FilterQueryString, pageNumber + 1);
                },
                GoLast: function ():void {
                    _this.RedirectService.RedirectToFilteredList(_this.EntityName, _this.FilterQueryString, totalPages);
                }
            };
        }
    }
}
