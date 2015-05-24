/// <reference path="./browser.ts" />
/// <reference path="./loginDialog.ts" />

module PageObjects {
    'use strict';

    export class EntityRecordForm {
        public static NavigateToCreate(entityName:string):void {
            var url:string = EntityRecordForm.UrlForEntityCreate(entityName);
            PageObjects.Browser.NavigateTo(url);
        }

        public static NavigateToCreateWithLogin(entityName:string):void {
            this.NavigateToCreate(entityName);
            var loginDialog:PageObjects.LoginDialog = PageObjects.LoginDialog.Current();
            loginDialog.LoginAsDefault();
        }

        //Urls
        public static UrlForEntityCreate(entityName:string):string {
            return '/entity/' + entityName;
        }
    }
}
