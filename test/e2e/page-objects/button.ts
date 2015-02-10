/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/extensions/stringExtensions.ts" />

'use strict';

module PageObjects {
    export class Button {
        constructor(private Selector:string) {
        }

        public Click():void {
            element(this.Selector).click();
        }

        public Disabled():any {
            return element(this.Selector).attr('disabled');
        }

        public Text():any {
            return element(this.Selector).text();
        }
    }
}
