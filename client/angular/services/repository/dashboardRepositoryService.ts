/// <reference path="../../interfaces/services/repository/IDashboardRepositoryService.ts" />
/// <reference path="../../interfaces/services/repository/IHttpWrapperService.ts" />
/// <reference path="../../interfaces/services/repository/IUrlLocatorService.ts" />
/// <reference path="../../interfaces/services/system/IRedirectService.ts" />
/// <reference path="../../interfaces/services/state/IEntityMetadataListCacheService.ts" />

'use strict';

//Service that communicates with server side Node api and retrieves/saves dashboard related data
module Services {
    export class DashboardRepositoryService implements Services.IDashboardRepositoryService {
        public static injection():any[] {
            return [
                'HttpWrapperService',
                'UrlLocatorService',
                'RedirectService',
                'EntityMetadataListCacheService',
                DashboardRepositoryService
            ];
        }

        constructor(private HttpWrapperService:Services.IHttpWrapperService,
                    private UrlLocatorService:Services.IUrlLocatorService,
                    private RedirectService:Services.IRedirectService,
                    private EntityMetadataListCacheService:Services.IEntityMetadataListCacheService) {
        }

        public GetActivitySummary(entityName:string, callback:(activityData:any[], errorsModel:any)=>void):void {
            var url:string = this.UrlLocatorService.GetUrlForDashboardActivitySummary(entityName);
            this.HttpWrapperService.Get(url, 'DashboardActivitySummary').then(
                //Success
                function (data:any[]) {
                    callback(data, null);
                },
                //Error
                function (errorsData) {
                    callback(null, errorsData);
                });
        }

        public GetMyRecentActivity(entityName:string, callback:(activityItems:any[], errorsModel:any)=>void):void {
            var _this = this;
            var url:string = this.UrlLocatorService.GetUrlForMyRecentActivity(entityName);
            this.HttpWrapperService.Get(url, 'MyRecentActivity').then(
                //Success
                function (data:any[]) {
                    _this.ExtendActivityList(data, function () {
                        callback(data, null);
                    });
                },
                //Error
                function (errorsData) {
                    callback(null, errorsData);
                });
        }

        public GetRecentActivity(entityName:string, callback:(activityItems:any[], errorsModel:any)=>void):void {
            var _this = this;
            var url:string = this.UrlLocatorService.GetUrlForRecentActivity(entityName);
            this.HttpWrapperService.Get(url, 'RecentActivity').then(
                //Success
                function (data:any[]) {
                    _this.ExtendActivityList(data, function () {
                        callback(data, null);
                    });
                },
                //Error
                function (errorsData) {
                    callback(null, errorsData);
                });
        }

        private ExtendActivityList(activityItems:any[], callback:()=>void):void {
            var _this = this;
            var itemsDone:number = 0;
            for (var i = 0; i < activityItems.length; i++) {
                var item:any = activityItems[i];
                _this.ExtendActivityListItemModel(item, function () {
                    if (++itemsDone == activityItems.length) callback();
                });
            }
        }

        private ExtendActivityListItemModel(activityItem:any, callback:()=>void):void {
            var _this = this;
            this.EntityMetadataListCacheService.LoadEntityMetadataFromCache(activityItem.Collection, function (metadata:Models.EntityMetadata) {
                activityItem.EntityName = metadata.EntityName;
                activityItem.Url = _this.RedirectService.GetEditEntityUrl(activityItem.Collection, activityItem.Id);
                callback();
            });
        }
    }
}
