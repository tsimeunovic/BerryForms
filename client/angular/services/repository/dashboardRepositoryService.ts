/// <reference path="../../interfaces/services/repository/IDashboardRepositoryService.ts" />
/// <reference path="../../interfaces/services/repository/IHttpWrapperService.ts" />
/// <reference path="../../interfaces/services/repository/IUrlLocatorService.ts" />
/// <reference path="../../interfaces/services/system/IRedirectService.ts" />
/// <reference path="../../interfaces/services/state/IEntityMetadataListCacheService.ts" />

//Service that communicates with server side Node api and retrieves/saves dashboard related data
module Services {
    'use strict';

    export class DashboardRepositoryService implements Services.IDashboardRepositoryService {
        //@ngInject
        constructor(private HttpWrapperService:Services.IHttpWrapperService,
                    private UrlLocatorService:Services.IUrlLocatorService,
                    private RedirectService:Services.IRedirectService,
                    private EntityMetadataListCacheService:Services.IEntityMetadataListCacheService) {
        }

        public GetActivitySummary(entityName:string, callback:(activityData:any[], errorsModel:any) => void):void {
            var url:string = this.UrlLocatorService.GetUrlForDashboardActivitySummary(entityName);
            this.HttpWrapperService.Get(url, 'DashboardActivitySummary').then(
                //Success
                function (data:any[]):void {
                    callback(data, null);
                },
                //Error
                function (errorsData:any):void {
                    callback(null, errorsData);
                });
        }

        public GetMyLastActivity(entityName:string, callback:(activityItems:any[], errorsModel:any) => void):void {
            var _this:DashboardRepositoryService = this;
            var url:string = this.UrlLocatorService.GetUrlForMyLastActivity(entityName);
            this.HttpWrapperService.Get(url, 'MyLastActivity').then(
                //Success
                function (data:any[]):void {
                    _this.ExtendActivityList(data, function ():void {
                        callback(data, null);
                    });
                },
                //Error
                function (errorsData:any):void {
                    callback(null, errorsData);
                });
        }

        public GetLastActivity(entityName:string, callback:(activityItems:any[], errorsModel:any) => void):void {
            var _this:DashboardRepositoryService = this;
            var url:string = this.UrlLocatorService.GetUrlForLastActivity(entityName);
            this.HttpWrapperService.Get(url, 'LastActivity').then(
                //Success
                function (data:any[]):void {
                    _this.ExtendActivityList(data, function ():void {
                        callback(data, null);
                    });
                },
                //Error
                function (errorsData:any):void {
                    callback(null, errorsData);
                });
        }

        private ExtendActivityList(activityItems:any[], callback:() => void):void {
            if (activityItems.length === 0) {
                callback();
                return;
            }

            var _this:DashboardRepositoryService = this;
            var itemsDone:number = 0;
            for (var i:number = 0; i < activityItems.length; i++) {
                var item:any = activityItems[i];
                _this.ExtendActivityListItemModel(item, activityItems, function ():void {
                    if (++itemsDone === activityItems.length) {
                        callback();
                    }
                });
            }
        }

        private ExtendActivityListItemModel(activityItem:any, allItems:any[], callback:() => void):void {
            var _this:DashboardRepositoryService = this;
            var deletedPredicate:(it:any) => boolean = function (it:any):boolean {
                return it.Collection === activityItem.Collection &&
                    it.Id === activityItem.Id &&
                    it.Operation === 'delete';
            };

            this.EntityMetadataListCacheService.LoadEntityMetadataFromCache(activityItem.Collection, function (metadata:Models.EntityMetadata):void {
                activityItem.EntityName = metadata.EntityName;
                activityItem.Deleted = allItems.any(deletedPredicate);
                activityItem.Url = !activityItem.Deleted ?
                    _this.RedirectService.GetEditEntityUrl(activityItem.Collection, activityItem.Id) :
                    null;
                callback();
            });
        }
    }
}
