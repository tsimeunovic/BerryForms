/// <reference path="./browser.ts" />

'use strict';

module PageObjects {
    export class EntityRecordForm {
        public static NavigateToCreate(entityName:string):void {
            var url = EntityRecordForm.UrlForEntityCreate(entityName);
            PageObjects.Browser.NavigateTo(url);
        }

        public static NavigateToCreateWithLogin(entityName:string):void {
            this.NavigateToCreate(entityName);
            var loginDialog:PageObjects.LoginDialog = PageObjects.LoginDialog.Current();
            loginDialog.LoginAsDefault();
        }

        //Urls
        public static UrlForEntityCreate(entityName:string):string {
            return '/entity/' + entityName
        }
    }
}
