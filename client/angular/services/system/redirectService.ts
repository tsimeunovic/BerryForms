/// <reference path="../../interfaces/services/system/IRedirectService.ts" />
/// <reference path="../../../extensions/stringExtensions.ts" />

'use strict';

//Service used to switch views across application
module Services {
    export class RedirectService implements Services.IRedirectService {
        public static injection():any[] {
            return [
                '$location',
                'MessagingService',
                RedirectService
            ];
        }

        constructor(private LocationService:any,
                    private MessagingService:Services.IMessagingService) {
        }

        private ResetLoadingsBeforeRedirect():void {
            this.MessagingService.Messages.Loading.Reset.publish();
        }

        //Urls
        public GetEditEntityUrl(entityName:string, entityId:number):string {
            var urlTemplate:string = '/entity/{0}/id/{1}';
            return urlTemplate.format([entityName, entityId.toString()]);
        }

        private GetCreateEntitySchemaUrl():string {
            return '/schema/entity';
        }

        private GetEditEntitySchemaUrl(entityName:string):string {
            var urlTemplate:string = '/schema/entity/{0}';
            return urlTemplate.format([entityName]);
        }

        public GetCreateEntityUrl(entityName:string):string {
            var urlTemplate:string = '/entity/{0}';
            return urlTemplate.format([entityName]);
        }

        private GetEntityPageUrl(entityName:string, entityId:number, pageNumber:number):string {
            var urlTemplate:string = '/entity/{0}';
            var entityIdStr = entityId ? entityId.toString() : null;
            if (!(pageNumber > 1)) pageNumber = null; //Omit 1 and invalid numbers
            var pageNumberStr = pageNumber ? pageNumber.toString() : null;

            if (entityId && pageNumber) urlTemplate = '/entity/{0}/page/{2}/id/{1}';
            else if (entityId) urlTemplate = '/entity/{0}/id/{1}';
            else if (pageNumber)urlTemplate = '/entity/{0}/page/{2}';
            return urlTemplate.format([entityName, entityIdStr, pageNumberStr]);
        }

        private GetFilteredListPageUrl(entityName:string, pageNumber:number):string {
            var urlTemplate:string = '/entity/{0}/filteredlist';
            var pageNumberStr = pageNumber ? pageNumber.toString() : null;
            if (pageNumberStr) urlTemplate = '/entity/{0}/filteredlist/page/{1}';
            return urlTemplate.format([entityName, pageNumberStr]);
        }

        //Redirects
        public RedirectToCreateEntitySchema():void {
            var url = this.GetCreateEntitySchemaUrl();
            this.ResetLoadingsBeforeRedirect();
            this.LocationService.path(url);
        }

        public RedirectToEditEntitySchema(entityName:string):void {
            var url = this.GetEditEntitySchemaUrl(entityName);
            this.ResetLoadingsBeforeRedirect();
            this.LocationService.path(url);
        }

        public RedirectToCreateEntity(entityName:string):void {
            var url = this.GetCreateEntityUrl(entityName);
            this.ResetLoadingsBeforeRedirect();
            this.LocationService.path(url);
        }

        public RedirectToEditEntity(entityName:string, entityId:number):void {
            var url = this.GetEditEntityUrl(entityName, entityId);
            this.ResetLoadingsBeforeRedirect();
            this.LocationService.path(url);
        }

        public RedirectToEntityPage(entityName:string, entityId:number, pageNumber:number):void {
            var url = this.GetEntityPageUrl(entityName, entityId, pageNumber);
            this.ResetLoadingsBeforeRedirect();
            this.LocationService.path(url);
        }

        public RedirectToFilteredList(entityName:string, filterQs:string, pageNumber:number):void {
            var url = this.GetFilteredListPageUrl(entityName, pageNumber);
            this.ResetLoadingsBeforeRedirect();
            this.LocationService.path(url).search(filterQs || '');
        }
    }
}
