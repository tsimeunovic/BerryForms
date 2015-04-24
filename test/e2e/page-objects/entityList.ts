/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/extensions/stringExtensions.ts" />

'use strict';

module PageObjects {
    export class EntityList {
        constructor() {
            this.ListSelector = '.entityList';
            this.ListScopeName = 'List';
        }

        private ListSelector:string;
        private ListScopeName:string;

        public GetListItems():any {
            var listItemSelector = '.entityRecord';
            return using(this.ListSelector, this.ListScopeName).element(listItemSelector);
        }

        public EditItem(itemIndex:number):void {
            var listItemSelector = ('.entityRecord:nth-child({0}) .commandEdit').format([itemIndex.toString()]);
            using(this.ListSelector, this.ListScopeName).element(listItemSelector).click();
        }

        public DeleteItem(itemIndex:number):void {
            var listItemSelector = ('.entityRecord:nth-child({0}) .commandDelete').format([itemIndex.toString()]);
            using(this.ListSelector, this.ListScopeName).element(listItemSelector).click();
        }

        public TotalPages():any {
            var totalPagesSelector = '.totalPages';
            return using(this.ListSelector, this.ListScopeName).element(totalPagesSelector).text();
        }

        public GoToFirstPage():void {
            var firstPageLinkSelector = '.listPaging a.first';
            return using(this.ListSelector, this.ListScopeName).element(firstPageLinkSelector).click();
        }

        public GoToPreviousPage():void {
            var previousPageLinkSelector = '.listPaging a.previous';
            return using(this.ListSelector, this.ListScopeName).element(previousPageLinkSelector).click();
        }

        public GoToNextPage():void {
            var nextPageLinkSelector = '.listPaging a.next';
            return using(this.ListSelector, this.ListScopeName).element(nextPageLinkSelector).click();
        }

        public GoToLastPage():void {
            var lastPageLinkSelector = '.listPaging a.last';
            return using(this.ListSelector, this.ListScopeName).element(lastPageLinkSelector).click();
        }

        public static Current():PageObjects.EntityList {
            return new PageObjects.EntityList();
        }
    }
}
