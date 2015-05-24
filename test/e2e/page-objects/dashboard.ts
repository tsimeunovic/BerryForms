/// <reference path="./browser.ts" />
/// <reference path="../page-objects/loginDialog.ts" />
/// <reference path="../../../client/extensions/stringExtensions.ts" />

module PageObjects {
    'use strict';

    export class Dashboard {
        //Navigation
        public static DashboardUrlPattern:string = '/dashboard';
        public static DashboardUrlForEntityPattern:string = '/dashboard/{0}';

        public static NavigateToGlobalDashboardWithLogin():void {
            PageObjects.Browser.NavigateTo(this.DashboardUrlPattern);
            var loginDialog:PageObjects.LoginDialog = PageObjects.LoginDialog.Current();
            loginDialog.LoginAsDefault();
        }

        //Urls
        public static DashboardUrl():string {
            return Dashboard.DashboardUrlPattern;
        }

        public static DashboardUrlForEntity(entityName:string):string {
            return Dashboard.DashboardUrlForEntityPattern.format([entityName]);
        }
    }
}
