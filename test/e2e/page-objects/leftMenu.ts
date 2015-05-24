/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/extensions/stringExtensions.ts" />

module PageObjects {
    'use strict';

    export class LeftMenu {
        constructor() {
            this.LeftMenuSelector = '.leftMenu';
            this.LeftMenuScopeName = 'LeftMenu';
        }

        private LeftMenuSelector:string;
        private LeftMenuScopeName:string;

        public static Current():PageObjects.LeftMenu {
            return new PageObjects.LeftMenu();
        }

        public GetEntityIcons():any {
            var entityIconsSelector:string = '.menuicon.entityicon';
            return using(this.LeftMenuSelector, this.LeftMenuScopeName).element(entityIconsSelector);
        }

        public ClickIconNamed(name:string):void {
            var entityIconSelector:string = ('[title="{0}"] a').format([name]);
            element(entityIconSelector).click();
        }

        public ClickNthGlobalIcon(position:number):void {
            var entityIconSelector:string =
                ('div.leftMenu div.leftMenuEntitiesList:nth-child(1) div.glyphicon.menuicon:nth-child({0}) a').format([position.toString()]);
            element(entityIconSelector).click();
        }

        public ClickNthEntityIcon(position:number):void {
            var entityIconSelector:string =
                ('div.leftMenu div.leftMenuEntitiesList:nth-child(2) div.glyphicon.menuicon:nth-child({0}) a').format([position.toString()]);
            element(entityIconSelector).click();
        }
    }
}
