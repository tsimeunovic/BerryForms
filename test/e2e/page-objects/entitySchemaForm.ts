/// <reference path="./browser.ts" />
/// <reference path="./loginDialog.ts" />

module PageObjects {
    'use strict';

    export class EntitySchemaForm {
        //Navigation
        public static CreateEntityUrlPattern:string = '/schema/entity';
        public static NavigateToCreate():void {
            var url:string = '/schema/entity';
            PageObjects.Browser.NavigateTo(url);
        }

        public static NavigateToCreateWithLogin():void {
            this.NavigateToCreate();
            var loginDialog:PageObjects.LoginDialog = PageObjects.LoginDialog.Current();
            loginDialog.LoginAsDefault(false);
        }

        public static NavigateToEdit(entityName:string):void {
            var url:string = EntitySchemaForm.UrlForSchemaEdit(entityName);
            PageObjects.Browser.NavigateTo(url);
        }

        public static NavigateToEditWithLogin(entityName:string):void {
            this.NavigateToEdit(entityName);
            var loginDialog:PageObjects.LoginDialog = PageObjects.LoginDialog.Current();
            loginDialog.LoginAsDefault(false);
        }

        //Urls
        public static UrlForNewSchema():string {
            return '/schema/entity';
        }

        public static UrlForSchemaEdit(entityName:string):string {
            return '/schema/entity/' + entityName;
        }
    }
}
