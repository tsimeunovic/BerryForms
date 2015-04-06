/// <reference path="./browser.ts" />
/// <reference path="../../../client/extensions/stringExtensions.ts" />

'use strict';

module PageObjects {
    export class Dashboard {
        //Navigation
        public static DashboardUrlPattern:string = '/dashboard';
        public static DashboardUrlForEntityPattern:string = '/dashboard/{0}';

        //Urls
        public static DashboardUrl():string {
            return Dashboard.DashboardUrlPattern;
        }

        public static DashboardUrlForEntity(entityName:string):string {
            return Dashboard.DashboardUrlForEntityPattern.format([entityName]);
        }
    }
}
