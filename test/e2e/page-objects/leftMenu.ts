/// <reference path="../../jasmine.d.ts" />

'use strict';

module PageObjects {
    export class LeftMenu {
        constructor() {
            this.LeftMenuSelector = '.leftMenu';
            this.LeftMenuScopeName = 'LeftMenu';
        }

        private LeftMenuSelector:string;
        private LeftMenuScopeName:string;

        public GetEntityIcons():any {
            var entityIconsSelector = '.menuicon.entityicon';
            return using(this.LeftMenuSelector, this.LeftMenuScopeName).element(entityIconsSelector);
        }

        public ClickIconNamed(name:string):void {
            var entityIconSelector = ('[title="{0}"] a').format([name]);
            element(entityIconSelector).click();
        }

        public static Current():PageObjects.LeftMenu {
            return new PageObjects.LeftMenu();
        }
    }
}
