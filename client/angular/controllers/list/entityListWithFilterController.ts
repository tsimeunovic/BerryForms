/// <reference path="../base/baseListController.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../../interfaces/services/state/IEntityListCacheService.ts" />
/// <reference path="../../interfaces/services/state/IEntityMetadataListCacheService.ts" />
/// <reference path="../../interfaces/services/system/IRedirectService.ts" />
/// <reference path="../../interfaces/services/localization/ILocalizationService.ts" />
/// <reference path="../../interfaces/services/mapping/IFilterConverterService.ts" />
/// <reference path="../../models/entityModel.ts" />
/// <reference path="../../../extensions/arrayExtensions.ts" />
/// <reference path="../../../extensions/stringExtensions.ts" />
/// <reference path="../../../extensions/objectExtensions.ts" />
/// <reference path="../../../static/routeParams.ts" />

'use strict';

//Controller for entity records list with filter
module Controllers {
    export class EntityListWithFilterController extends BaseListController {
        public static injection():any[] {
            return [
                '$scope',
                'MessagingService',
                'NotificationService',
                'QueueService',
                'StateService',
                '$routeParams',
                'EntityListCacheService',
                'EntityMetadataListCacheService',
                'RedirectService',
                'LocalizationService',
                'FilterConverterService',
                EntityListWithFilterController
            ]
        }

        constructor(Scope:any,
                    MessagingService:Services.IMessagingService,
                    NotificationService:Services.INotificationService,
                    QueueService:Services.IQueueService,
                    StateService:Services.IStateService,
                    private RouteParams:any,
                    private EntityListCacheService:Services.IEntityListCacheService,
                    private EntityMetadataListCacheService:Services.IEntityMetadataListCacheService,
                    private RedirectService:Services.IRedirectService,
                    private LocalizationService:Services.ILocalizationService,
                    private FilterConverterService:Services.IFilterConverterService) {
            super(Scope, Static.ControllerArea.Entity, MessagingService, NotificationService, QueueService, StateService);

            var entityName = RouteParams[Static.RouteParams.EntityName];
            var pageNumber = RouteParams[Static.RouteParams.PageNumber];
            var pageIndex = pageNumber - 1;

            this.EntityName = entityName;
            this.PageIndex = isNaN(pageIndex) ? 0 : pageIndex;

            this.InitializeScope();
        }

        private EntityName:string;
        private PageIndex:number;
        private EntityMetadata:Models.EntityMetadata;
        private FilterEntity:Models.Entity;
        private FilterMetadata:Models.EntityMetadata;
        private DatabaseQuery:any;
        private FilterQueryString:string;

        private InitializeScope():void {
            this.Scope.Search = this.DoFilteredSearch.bind(this);
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

                this.Scope.Entity = this.FilterEntity;
                this.Scope.IsFilterEmpty = Object.isEmpty(this.FilterEntity.Data);
                this.Scope.IsFilterCollapsed = this.Scope.IsFilterEmpty;
                this.Scope.EntityMetadata = this.EntityMetadata;
                this.Scope.FilterMetadata = this.FilterMetadata;
                this.Scope.EmptyListMessage = this.LocalizationService.Resources.NoRecordsOfFilteredEntity.format([metadata.EntityName]);
                this.Scope.ListHeader = this.LocalizationService.Resources.ListOfRecords.format([metadata.EntityName]);

                this.LoadEntityList();
            }
            else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }

        private DoFilteredSearch():void {
            var filterQueryString = this.FilterConverterService.CreateFilterQueryString(this.EntityMetadata, this.FilterEntity);
            this.RedirectService.RedirectToFilteredList(this.EntityName, filterQueryString, 1);
        }

        private LoadEntityList():void {
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.EntityList);
            this.EntityListCacheService.LoadEntityListPage(this.EntityName, this.DatabaseQuery, this.PageIndex, this.LoadEntityListCompleted.bind(this));
        }

        private LoadEntityListCompleted(entities:Models.Entity[], query:any, pageIndex:number, totalPages:number, errorsModel:any):void {
            if (!Object.haveEqualData(this.DatabaseQuery, query)) return;
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.EntityList);

            if (errorsModel == null) {
                this.SetPaging(pageIndex, totalPages);
                this.Scope.EntityList = entities;
            }
            else {
                this.SetPaging(pageIndex, 0);
                this.NotificationService.HandleErrorsModel(errorsModel);
            }
        }

        private SetPaging(pageIndex:number, totalPages:number) {
            var _this = this;
            var pageNumber = pageIndex + 1;
            this.Scope.Paging = {
                //State
                ShowPaging: totalPages > 1 || (pageNumber > totalPages && pageNumber != 1) || pageNumber < 0,
                CanGoFirst: pageNumber != 1,
                CanGoPrevious: pageNumber > 1,
                CanGoNext: pageNumber < totalPages,
                CanGoLast: pageNumber != totalPages,
                CurrentPage: pageNumber,
                SelectedPage: pageNumber,
                TotalPages: totalPages,

                //Actions
                GoSelected: function () {
                    _this.RedirectService.RedirectToFilteredList(_this.EntityName, _this.FilterQueryString, _this.Scope.Paging.SelectedPage);
                },
                GoFirst: function () {
                    _this.RedirectService.RedirectToFilteredList(_this.EntityName, _this.FilterQueryString, 1);
                },
                GoPrevious: function () {
                    _this.RedirectService.RedirectToFilteredList(_this.EntityName, _this.FilterQueryString, pageNumber - 1);
                },
                GoNext: function () {
                    _this.RedirectService.RedirectToFilteredList(_this.EntityName, _this.FilterQueryString, pageNumber + 1);
                },
                GoLast: function () {
                    _this.RedirectService.RedirectToFilteredList(_this.EntityName, _this.FilterQueryString, totalPages);
                }
            };
        }
    }
}
