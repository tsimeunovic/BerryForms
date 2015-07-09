/// <reference path="../../interfaces/services/repository/IUrlLocatorService.ts" />
/// <reference path="../../../extensions/stringExtensions.ts" />
/// <reference path="../../../config/config.ts" />

//Service responsible for resolving urls for all Node api calls
module Services {
    'use strict';

    export class UrlLocatorService implements Services.IUrlLocatorService {
        //@ngInject
        constructor() {
            //Nothing to do here
        }

        private ApiBaseUrl:string = Config.Client.ApiBaseUrl;

        //Server routes
        public GetUrlForEntityMetadataListRetrieve():string {
            var url:string = this.ApiBaseUrl + 'metadata/all';
            return this.AddPreventCacheParameter(url);
        }

        public GetUrlForEntityMetadataRetrieve(entityName:string):string {
            var url:string = (this.ApiBaseUrl + 'metadata/{0}/{0}').format([entityName]);
            return this.AddPreventCacheParameter(url);
        }

        public GetUrlForEntityMetadataSave(entityName:string):string {
            return (this.ApiBaseUrl + 'metadata/{0}').format([entityName]);
        }

        public GetUrlForPagedEntityListRetrieve(entityName:string, pageNumber:number, pageSize:number):string {
            var pageNumberStr:string = pageNumber.toString();
            var pageSizeStr:string = pageSize.toString();
            var url:string = (this.ApiBaseUrl + 'entity/{0}/page/{1}/{2}').format([entityName, pageNumberStr, pageSizeStr]);
            return this.AddPreventCacheParameter(url);
        }

        public GetUrlForFilteredListRetrieve(entityName:string, pageNumber:number, pageSize:number):string {
            var pageNumberStr:string = pageNumber.toString();
            var pageSizeStr:string = pageSize.toString();
            return (this.ApiBaseUrl + 'entity/{0}/filtered/page/{1}/{2}').format([entityName, pageNumberStr, pageSizeStr]);
        }

        public GetUrlForEntityListRetrieve(entityName:string):string {
            var url:string = (this.ApiBaseUrl + 'entity/{0}').format([entityName]);
            return this.AddPreventCacheParameter(url);
        }

        public GetUrlForEntityRetrieve(entityName:string, entityId:number):string {
            var entityIdStr:string = entityId.toString();
            var url:string = (this.ApiBaseUrl + 'entity/{0}/{1}').format([entityName, entityIdStr]);
            return this.AddPreventCacheParameter(url);
        }

        public GetUrlForEntitySave(entityName:string):string {
            return (this.ApiBaseUrl + 'entity/{0}').format([entityName]);
        }

        public GetUrlForEntityDelete(entityName:string, entityId:number):string {
            var entityIdStr:string = entityId.toString();
            return (this.ApiBaseUrl + 'entity/{0}/{1}').format([entityName, entityIdStr]);
        }

        public GetUrlForLogin():string {
            return this.ApiBaseUrl + 'user/login';
        }

        public GetUrlForDashboardActivitySummary(entityName:string):string {
            var url:string = this.ApiBaseUrl + 'dashboard/activity/summary';
            if (entityName) {
                url = (this.ApiBaseUrl + 'dashboard/activity/{0}/summary').format([entityName]);
            }
            return this.AddPreventCacheParameter(url);
        }

        public GetUrlForMyLastActivity(entityName:string):string {
            var url:string = this.ApiBaseUrl + 'dashboard/activity/me';
            if (entityName) {
                url = (this.ApiBaseUrl + 'dashboard/activity/{0}/me').format([entityName]);
            }
            return this.AddPreventCacheParameter(url);
        }

        public GetUrlForLastActivity(entityName:string):string {
            var url:string = this.ApiBaseUrl + 'dashboard/activity/all';
            if (entityName) {
                url = (this.ApiBaseUrl + 'dashboard/activity/{0}/all').format([entityName]);
            }
            return this.AddPreventCacheParameter(url);
        }

        private AddPreventCacheParameter(url:string):string {
            return url + '?t=' + new Date().getTime();
        }
    }
}
