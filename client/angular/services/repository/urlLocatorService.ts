/// <reference path="../../interfaces/services/repository/IUrlLocatorService.ts" />
/// <reference path="../../../extensions/stringExtensions.ts" />
/// <reference path="../../../config/config.ts" />

'use strict';

//Service responsible for resolving urls for all Node api calls
module Services {
    export class UrlLocatorService implements Services.IUrlLocatorService {
        public static injection():any[] {
            return [
                UrlLocatorService
            ];
        }

        private ApiBaseUrl:string = Config.Client.ApiBaseUrl;

        private AddPreventCacheParameter(url:string):string {
            return url + '?t=' + new Date().getTime();
        }

        public GetUrlForEntityMetadataListRetrieve():string {
            var url = this.ApiBaseUrl + 'metadata/all';
            return this.AddPreventCacheParameter(url);
        }

        public GetUrlForEntityMetadataRetrieve(entityName:string):string {
            var url = (this.ApiBaseUrl + 'metadata/{0}/{0}').format([entityName]);
            return this.AddPreventCacheParameter(url);
        }

        public GetUrlForEntityMetadataSave(entityName:string):string {
            return (this.ApiBaseUrl + 'metadata/{0}').format([entityName]);
        }

        public GetUrlForPagedEntityListRetrieve(entityName:string, pageNumber:number, pageSize:number):string {
            var pageNumberStr = pageNumber.toString();
            var pageSizeStr = pageSize.toString();
            var url = (this.ApiBaseUrl + 'entity/{0}/page/{1}/{2}').format([entityName, pageNumberStr, pageSizeStr]);
            return this.AddPreventCacheParameter(url);
        }

        public GetUrlForFilteredListRetrieve(entityName:string, pageNumber:number, pageSize:number):string {
            var pageNumberStr = pageNumber.toString();
            var pageSizeStr = pageSize.toString();
            return (this.ApiBaseUrl + 'entity/{0}/filtered/page/{1}/{2}').format([entityName, pageNumberStr, pageSizeStr]);
        }

        public GetUrlForEntityListRetrieve(entityName:string):string {
            var url = (this.ApiBaseUrl + 'entity/{0}').format([entityName]);
            return this.AddPreventCacheParameter(url);
        }

        public GetUrlForEntityRetrieve(entityName:string, entityId:number):string {
            var entityIdStr = entityId.toString();
            var url = (this.ApiBaseUrl + 'entity/{0}/{1}').format([entityName, entityIdStr]);
            return this.AddPreventCacheParameter(url);
        }

        public GetUrlForEntitySave(entityName:string):string {
            return (this.ApiBaseUrl + 'entity/{0}').format([entityName]);
        }

        public GetUrlForEntityDelete(entityName:string, entityId:number):string {
            var entityIdStr = entityId.toString();
            return (this.ApiBaseUrl + 'entity/{0}/{1}').format([entityName, entityIdStr]);
        }
    }
}
