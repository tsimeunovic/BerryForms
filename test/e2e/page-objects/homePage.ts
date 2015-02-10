/// <reference path="./browser.ts" />

'use strict';

module PageObjects {
    export class HomePage {
        //Navigation
        public static NavigateTo():void {
            PageObjects.Browser.NavigateTo('/');
        }
    }
}
