/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/extensions/stringExtensions.ts" />

module PageObjects {
    'use strict';

    export class HeaderIcons {
        constructor() {
            this.FieldForm = {};
            this.EntityForm = {};
            this.FieldsList = {};
            this.FieldsList.NewField = this.IconFrom('list', 'asterisk');
            this.FieldsList.ListOfEntities = this.IconFrom('list', 'th-list');

            this.EntitiesList = {};
            this.EntitiesList.FilteredList = this.IconFrom('list', 'filter');
        }

        public FieldForm:any;
        public EntityForm:any;
        public FieldsList:any;
        public EntitiesList:any;

        public static Current():PageObjects.HeaderIcons {
            return new PageObjects.HeaderIcons();
        }

        private IconFrom(parentRole:string, iconClass:string):any {
            var scopeSelector:string = ('[data-role="{0}"] h1').format([parentRole]);
            var iconSelector:string = ('.glyphicon.glyphicon-{0}').format([iconClass]);
            return using(scopeSelector, 'HeaderIcons').element(iconSelector);
        }
    }
}
