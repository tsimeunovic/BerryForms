declare var browser:any;

module PageObjects {
    'use strict';

    export class Browser {
        public static NavigateTo(urlSegment:string):void {
            browser().navigateTo('/#' + urlSegment);
        }
        public static CurrentUrl():any {
            return browser().location().url();
        }
    }
}
