/// <reference path="./browser.ts" />
/// <reference path="./loginDialog.ts" />

module PageObjects {
    'use strict';

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
