/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/extensions/stringExtensions.ts" />

'use strict';

module PageObjects {
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

        private IconFrom(parentRole:string, iconClass:string):any {
            var scopeSelector = ('[data-role="{0}"] h1').format([parentRole]);
            var iconSelector = ('.glyphicon.glyphicon-{0}').format([iconClass]);
            return using(scopeSelector, 'HeaderIcons').element(iconSelector);
        }

        public static Current():PageObjects.HeaderIcons {
            return new PageObjects.HeaderIcons();
        }
    }
}
