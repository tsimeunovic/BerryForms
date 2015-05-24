/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/extensions/stringExtensions.ts" />

module PageObjects {
    'use strict';

    export class EntityList {
        constructor() {
            this.ListSelector = '.entityList';
            this.ListScopeName = 'List';
        }

        private ListSelector:string;
        private ListScopeName:string;

        public static Current():PageObjects.EntityList {
            return new PageObjects.EntityList();
        }

        public GetListItems():any {
            var listItemSelector:string = '.entityRecord';
            return using(this.ListSelector, this.ListScopeName).element(listItemSelector);
        }

        public GetNthItem(itemIndex:number):any {
            var nthItemSelector:string = ('.entityRecord:nth-child({0})').format([itemIndex.toString()]);
            return using(this.ListSelector, this.ListScopeName).element(nthItemSelector);
        }

        public EditItem(itemIndex:number):void {
            var listItemSelector:string = ('.entityRecord:nth-child({0}) .commandEdit').format([itemIndex.toString()]);
            using(this.ListSelector, this.ListScopeName).element(listItemSelector).click();
        }

        public DeleteItem(itemIndex:number):void {
            var listItemSelector:string = ('.entityRecord:nth-child({0}) .commandDelete').format([itemIndex.toString()]);
            using(this.ListSelector, this.ListScopeName).element(listItemSelector).click();
        }

        public TotalPages():any {
            var totalPagesSelector:string = '.totalPages';
            return using(this.ListSelector, this.ListScopeName).element(totalPagesSelector).text();
        }

        public GoToFirstPage():void {
            var firstPageLinkSelector:string = '.listPaging a.first';
            return using(this.ListSelector, this.ListScopeName).element(firstPageLinkSelector).click();
        }

        public GoToPreviousPage():void {
            var previousPageLinkSelector:string = '.listPaging a.previous';
            return using(this.ListSelector, this.ListScopeName).element(previousPageLinkSelector).click();
        }

        public GoToNextPage():void {
            var nextPageLinkSelector:string = '.listPaging a.next';
            return using(this.ListSelector, this.ListScopeName).element(nextPageLinkSelector).click();
        }

        public GoToLastPage():void {
            var lastPageLinkSelector:string = '.listPaging a.last';
            return using(this.ListSelector, this.ListScopeName).element(lastPageLinkSelector).click();
        }
    }
}
