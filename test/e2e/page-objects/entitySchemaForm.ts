/// <reference path="./browser.ts" />
/// <reference path="./loginDialog.ts" />

'use strict';

module PageObjects {
    export class EntitySchemaForm {
        //Navigation
        public static CreateEntityUrlPattern:string = '/schema/entity';
        public static NavigateToCreate():void {
            var url = '/schema/entity';
            PageObjects.Browser.NavigateTo(url);
        }

        public static NavigateToCreateWithLogin():void {
            this.NavigateToCreate();
            var loginDialog:PageObjects.LoginDialog = PageObjects.LoginDialog.Current();
            loginDialog.LoginAsDefault();
        }

        public static NavigateToEdit(entityName:string):void {
            var url = EntitySchemaForm.UrlForSchemaEdit(entityName);
            PageObjects.Browser.NavigateTo(url);
        }

        public static NavigateToEditWithLogin(entityName:string):void {
            this.NavigateToEdit(entityName);
            var loginDialog:PageObjects.LoginDialog = PageObjects.LoginDialog.Current();
            loginDialog.LoginAsDefault();
        }

        //Urls
        public static UrlForSchemaEdit(entityName:string):string {
            return '/schema/entity/' + entityName
        }
    }
}
