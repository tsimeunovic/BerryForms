/// <reference path="../../interfaces/services/system/IRedirectService.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../../../extensions/stringExtensions.ts" />

//Service used to switch views across application
module Services {
    'use strict';

    export class RedirectService implements Services.IRedirectService {
        private LocationService:any;

        //@ngInject
        constructor($location:any,
                    private MessagingService:Services.IMessagingService) {
            this.LocationService = $location;
        }

        //Redirects
        public RedirectToHomeScreen():void {
            var url:string = this.GetHomeScreenUrl();
            this.ResetLoadingsBeforeRedirect();
            this.LocationService.path(url);
        }

        public RedirectToCreateEntitySchema():void {
            var url:string = this.GetCreateEntitySchemaUrl();
            this.ResetLoadingsBeforeRedirect();
            this.LocationService.path(url);
        }

        public RedirectToEditEntitySchema(entityName:string):void {
            var url:string = this.GetEditEntitySchemaUrl(entityName);
            this.ResetLoadingsBeforeRedirect();
            this.LocationService.path(url);
        }

        public RedirectToCreateEntity(entityName:string):void {
            var url:string = this.GetCreateEntityUrl(entityName);
            this.ResetLoadingsBeforeRedirect();
            this.LocationService.path(url);
        }

        public RedirectToEditEntity(entityName:string, entityId:number):void {
            var url:string = this.GetEditEntityUrl(entityName, entityId);
            this.ResetLoadingsBeforeRedirect();
            this.LocationService.path(url);
        }

        public RedirectToEntityPage(entityName:string, entityId:number, pageNumber:number):void {
            var url:string = this.GetEntityPageUrl(entityName, entityId, pageNumber);
            this.ResetLoadingsBeforeRedirect();
            this.LocationService.path(url);
        }

        public RedirectToFilteredList(entityName:string, filterQs:string, pageNumber:number):void {
            var url:string = this.GetFilteredListPageUrl(entityName, pageNumber);
            this.ResetLoadingsBeforeRedirect();
            this.LocationService.path(url).search(filterQs || '');
        }


        //Urls
        public GetEditEntityUrl(entityName:string, entityId:number):string {
            var urlTemplate:string = '/entity/{0}/id/{1}';
            return urlTemplate.format([entityName, entityId.toString()]);
        }

        public GetCreateEntityUrl(entityName:string):string {
            var urlTemplate:string = '/entity/{0}';
            return urlTemplate.format([entityName]);
        }

        private GetHomeScreenUrl():string {
            return '/';
        }

        private GetCreateEntitySchemaUrl():string {
            return '/schema/entity';
        }

        private GetEditEntitySchemaUrl(entityName:string):string {
            var urlTemplate:string = '/schema/entity/{0}';
            return urlTemplate.format([entityName]);
        }

        private GetEntityPageUrl(entityName:string, entityId:number, pageNumber:number):string {
            var urlTemplate:string = '/entity/{0}';
            var entityIdStr:string = entityId ? entityId.toString() : null;
            if (!(pageNumber > 1)) {
                //Omit 1 and invalid numbers
                pageNumber = null;
            }
            var pageNumberStr:string = pageNumber ? pageNumber.toString() : null;

            if (entityId && pageNumber) {
                urlTemplate = '/entity/{0}/page/{2}/id/{1}';
            } else if (entityId) {
                urlTemplate = '/entity/{0}/id/{1}';
            } else if (pageNumber) {
                urlTemplate = '/entity/{0}/page/{2}';
            }

            return urlTemplate.format([entityName, entityIdStr, pageNumberStr]);
        }

        private GetFilteredListPageUrl(entityName:string, pageNumber:number):string {
            var urlTemplate:string = '/entity/{0}/filteredlist';
            var pageNumberStr:string = pageNumber ? pageNumber.toString() : null;
            if (pageNumberStr) {
                urlTemplate = '/entity/{0}/filteredlist/page/{1}';
            }
            return urlTemplate.format([entityName, pageNumberStr]);
        }

        private ResetLoadingsBeforeRedirect():void {
            this.MessagingService.Messages.Loading.Reset.publish();
        }
    }
}
