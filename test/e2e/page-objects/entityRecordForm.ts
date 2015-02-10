/// <reference path="./browser.ts" />

'use strict';

module PageObjects {
    export class EntityRecordForm {
        public static NavigateToCreate(entityName:string):void {
            var url = EntityRecordForm.UrlForEntityCreate(entityName);
            PageObjects.Browser.NavigateTo(url);
        }

        //Urls
        public static UrlForEntityCreate(entityName:string):string {
            return '/entity/' + entityName
        }
    }
}
