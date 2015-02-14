/// <reference path="cacheBaseService.ts" />
/// <reference path="../../interfaces/services/state/IEntityListCacheService.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../../interfaces/services/interaction/INotificationService.ts" />
/// <reference path="../../interfaces/services/localization/ILocalizationService.ts" />
/// <reference path="../../interfaces/services/repository/IEntityRepositoryService.ts" />
/// <reference path="../../../extensions/objectExtensions.ts" />
/// <reference path="../../../config/config.ts" />

'use strict';

//Service that stores some of entity records of currently used type that matches query
module Services {
    export class EntityListCacheService extends Services.CacheBaseService<Models.Entity[]> implements Services.IEntityListCacheService {
        public static injection():any[] {
            return [
                'MessagingService',
                'EntityRepositoryService',
                'NotificationService',
                'LocalizationService',
                EntityListCacheService
            ];
        }

        constructor(private MessagingService:Services.IMessagingService,
                    private EntityRepositoryService:Services.IEntityRepositoryService,
                    private NotificationService:Services.INotificationService,
                    private LocalizationService:Services.ILocalizationService) {
            super();
            this.PageSize = Config.Client.EntityListPageSize;
            this.RegisterDependencies();
        }

        private Query:any;
        private PageSize:number;
        private EntitySystemName:string;
        private TotalCount:number;
        private TotalPages:number;
        private VersionIdentifier:any;

        private RegisterDependencies():void {
            //Adding new entity cause reload
            this.MessagingService.Messages.Entity.Created.subscribe(this.EntityCreatedHandler.bind(this));
            this.MessagingService.Messages.Entity.Modified.subscribe(this.EntityModifiedHandler.bind(this));
            this.MessagingService.Messages.Entity.Deleted.subscribe(this.EntityDeletedHandler.bind(this));
        }

        public InvalidateCache():void {
            this.Data = null;
            this.TotalCount = null;
            this.TotalPages = null;
            this.VersionIdentifier = null;
            this.MessagingService.Messages.Cache.EntityList.Invalidated.publish(this.EntitySystemName);
        }

        public LoadData(argument:any):void {
            //argument = { EntitySystemName, Query, PageIndex, PageSize, HasCurrent }
            if (this.IsLoading && this.EntitySystemName == argument.EntitySystemName && Object.haveEqualData(this.Query, argument.Query)) return;
            this.IsLoading = true;
            if (!argument.HasCurrent) this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.EntityListCache);
            this.EntityRepositoryService.LoadPagedFilteredResults(this.EntitySystemName, argument.Query, argument.PageIndex, argument.PageSize, this.LoadDataCompleted.bind(this));
        }

        public LoadDataCompleted(data:any, errorsModel:any):void {
            //data = { EntitySystemName, Query, Page: { PageIndex, TotalCount, TotalPages, StartIndex, LoadedCount, VersionIdentifier }, List : [] }
            if (errorsModel == null) {
                //Verify correct data or if cache is outdated
                if (data != null && (this.EntitySystemName != data.EntitySystemName || !Object.haveEqualData(this.Query, data.Query))) {
                    return;
                }

                if (this.TotalCount != data.Page.TotalCount ||
                    this.VersionIdentifier != data.Page.VersionIdentifier) {
                    this.InvalidateCache();
                    this.TotalCount = data.Page.TotalCount;
                    this.TotalPages = data.Page.TotalPages;
                    this.VersionIdentifier = data.Page.VersionIdentifier;
                    this.Data = new Array(this.TotalCount);
                }

                if (data.Page.PageIndex < 0 ||
                    (data.Page.PageIndex != 0 && data.Page.PageIndex >= data.Page.TotalPages)) {
                    //Non existing page
                    this.NotificationService.NotifyMessage(this.LocalizationService.Resources.NonExistingPage, Services.NotificationSeverity.Warning);
                }
                else if (data.List.length != data.Page.LoadedCount ||
                    data.Page.StartIndex + data.Page.LoadedCount > data.Page.TotalCount) {
                    //Other data integrity failure
                    this.NotificationService.NotifyMessage(this.LocalizationService.Resources.InvalidDataLoaded, Services.NotificationSeverity.Error);
                }
                else {
                    //Add loaded values to array
                    for (var i = 0; i < data.List.length; i++) {
                        this.Data[data.Page.StartIndex + i] = data.List[i];
                    }
                }

                this.MessagingService.Messages.Cache.EntityList.DataLoaded.publish(data);
            }
            else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }

            this.IsLoading = false;
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.EntityListCache);
        }

        public LoadEntityListPage(entitySystemName:string, query:any, pageIndex:number, callback:(entity:Models.Entity[], query:any, pageIndex:number, totalPages:number, errorsModel:any)=>void):void {
            var currentPageData = this.AssertEntityPageInCache(entitySystemName, query, pageIndex);

            if (currentPageData) {
                //Have current data
                callback(currentPageData, query, pageIndex, this.TotalPages, null);
            }
            else {
                //Have to wait
                var _this = this;
                var subscription = this.MessagingService.Messages.Cache.EntityList.DataLoaded.subscribe(
                    function (data:any) {
                        //data = { EntitySystemName, Query, Page: { PageIndex, TotalCount, TotalPages, StartIndex, LoadedCount, VersionIdentifier }, List : [] }
                        if (data.EntitySystemName == entitySystemName &&
                            Object.haveEqualData(query, data.Query) &&
                            data.Page.PageIndex == pageIndex) {
                            subscription();

                            if (_this.HasPageData(pageIndex)) {
                                //Success
                                var pageData = _this.GetPageData(pageIndex);
                                callback(pageData, query, pageIndex, _this.TotalPages, null);
                            }
                            else {
                                //Error loading
                                callback(null, query, pageIndex, null, {
                                    Type: 'Client', Errors: [
                                        {
                                            ErrorTypeKey: 'FindPagedError',
                                            ErrorParameters: [_this.EntitySystemName, pageIndex + 1]
                                        }
                                    ]
                                });
                            }
                        }
                    });
            }
        }

        private EntityCreatedHandler(createdEntity:Models.Entity):void {
            if (createdEntity.EntitySystemName != this.EntitySystemName) return;
            this.Data.unshift(createdEntity);
            this.TotalCount = this.Data.length;
            this.TotalPages = Math.ceil(this.TotalCount / this.PageSize);
            this.MessagingService.Messages.Cache.EntityList.Changed.publish(this.EntitySystemName);
        }

        private EntityModifiedHandler(modifiedEntity:Models.Entity):void {
            //Find modified entity in cache
            var entityPredicate = function (e:Models.Entity) {
                return e &&
                    e.EntitySystemName == modifiedEntity.EntitySystemName &&
                    e.Id == modifiedEntity.Id;
            };
            var modifiedEntityFromCache:Models.Entity = this.Data.single(entityPredicate);

            //Modify cache or invalidate it
            if (modifiedEntityFromCache) {
                this.Data.remove(modifiedEntityFromCache);
                this.Data.unshift(modifiedEntity);
                this.TotalCount = this.Data.length;
                this.TotalPages = Math.ceil(this.TotalCount / this.PageSize);
                this.MessagingService.Messages.Cache.EntityList.Changed.publish(this.EntitySystemName);
            }
            else {
                this.InvalidateCache();
            }
        }

        private EntityDeletedHandler(deletedEntity:Models.Entity):void {
            //Find deleted entity in cache
            var entityPredicate = function (e:Models.Entity) {
                return e &&
                    e.EntitySystemName == deletedEntity.EntitySystemName &&
                    e.Id == deletedEntity.Id;
            };
            var deletedEntityFromCache:Models.Entity = this.Data.single(entityPredicate);

            //Modify cache or invalidate it
            if (deletedEntityFromCache) {
                var deletedEntityFromCacheIndex:number = this.Data.indexOf(deletedEntityFromCache);
                this.Data.splice(deletedEntityFromCacheIndex, 1);
                this.TotalCount = this.Data.length;
                this.TotalPages = Math.ceil(this.TotalCount / this.PageSize);
                this.MessagingService.Messages.Cache.EntityList.Changed.publish(this.EntitySystemName);
            }
            else {
                this.InvalidateCache();
            }
        }

        private AssertEntityPageInCache(entitySystemName:string, query:any, pageIndex:number):Models.Entity[] {
            //Assert correct cache is used
            if (this.EntitySystemName != entitySystemName || !Object.haveEqualData(this.Query, query)) {
                this.InvalidateCache();
                this.EntitySystemName = entitySystemName;
                this.Query = query;
            }

            //Check for present data
            var hasCurrentPageData = this.HasPageData(pageIndex);

            //Check if sibling pages are loaded as well
            var hasPreviousPageData = pageIndex == 0 || this.HasPageData(pageIndex - 1);
            var hasNextPageData = pageIndex + 1 == this.TotalPages || this.HasPageData(pageIndex + 1);

            var hasAllNeededData = hasCurrentPageData && hasPreviousPageData && hasNextPageData;
            if (!hasAllNeededData) this.LoadData({
                EntitySystemName: entitySystemName,
                Query: query,
                PageIndex: pageIndex,
                PageSize: this.PageSize,
                HasCurrent: hasCurrentPageData
            });

            if (hasCurrentPageData) return this.GetPageData(pageIndex);
            else return null;
        }

        private HasPageData(pageIndex:number):boolean {
            if (this.Data == null || this.TotalCount == null) return false;
            var indexes = this.GetPageIndexes(pageIndex);
            if (indexes == null) return false;

            for (var i = indexes.StartIndex; i < indexes.EndIndex; i++) {
                if (!this.Data[i]) return false;
            }
            return true;
        }

        private GetPageData(pageIndex:number):Models.Entity[] {
            var indexes = this.GetPageIndexes(pageIndex);
            if (indexes == null) return null;
            return this.Data.slice(indexes.StartIndex, indexes.EndIndex);
        }

        private GetPageIndexes(pageIndex:number):any {
            var startIndex = pageIndex * this.PageSize;
            var endIndex = (pageIndex + 1) * this.PageSize;

            if (startIndex < 0 || endIndex < 0) return null;
            if (startIndex > this.Data.length) return null;
            if (endIndex > this.Data.length) endIndex = this.Data.length;

            return {
                StartIndex: startIndex,
                EndIndex: endIndex
            };
        }
    }
}