/// <reference path="./browser.ts" />

'use strict';

module PageObjects {
    export class HomePage {
        //Navigation
        public static NavigateTo():void {
            PageObjects.Browser.NavigateTo('/');
        }

        public static NavigateToWithLogin():void {
            this.NavigateTo();
            var loginDialog:PageObjects.LoginDialog = PageObjects.LoginDialog.Current();
            loginDialog.LoginAsDefault();
        }
    }
}
