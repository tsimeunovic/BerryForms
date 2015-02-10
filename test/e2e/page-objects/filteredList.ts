/// <reference path="./browser.ts" />
/// <reference path="../../../client/extensions/stringExtensions.ts" />

'use strict';

module PageObjects {
    export class FilteredList {
        constructor() {
            this.FilteredListSelector = '.entityDetailedList';
            this.FilteredListScopeName = 'FilteredList';
            this.PagingSelector = '.listPaging';
            this.PagingScopeName = 'ListPaging';
            this.FilterSelector = '.filter';
            this.FilterScopeName = 'Filter';
            this.FilterForm = PageObjects.Form.Current();
        }

        private FilterForm:PageObjects.Form;
        private FilteredListSelector:string;
        private FilteredListScopeName:string;
        private PagingSelector:string;
        private PagingScopeName:string;
        private FilterSelector:string;
        private FilterScopeName:string;

        public GetListItems():any {
            var filteredListItemSelector = '.entityRecord';
            return using(this.FilteredListSelector, this.FilteredListScopeName).element(filteredListItemSelector);
        }

        public ToggleExpand():void {
            var toggleButtonSelector = '.filterControls .control .glyphicon-filter';
            using(this.FilterSelector, this.FilterScopeName).element(toggleButtonSelector).click();
        }

        public ApplyFilterObject(filterObject:any):void {
            this.FilterForm.Fill(filterObject);
            var applyFilterButtonSelector = '.filterControls .control .glyphicon-search';
            using(this.FilterSelector, this.FilterScopeName).element(applyFilterButtonSelector).click();
        }

        public GoToFirstPage():void {
            var firstPageLinkSelector = 'a.first';
            return using(this.PagingSelector, this.PagingScopeName).element(firstPageLinkSelector).click();
        }

        public GoToPreviousPage():void {
            var previousPageLinkSelector = 'a.previous';
            return using(this.PagingSelector, this.PagingScopeName).element(previousPageLinkSelector).click();
        }

        public GoToNextPage():void {
            var nextPageLinkSelector = 'a.next';
            return using(this.PagingSelector, this.PagingScopeName).element(nextPageLinkSelector).click();
        }

        public GoToLastPage():void {
            var lastPageLinkSelector = 'a.last';
            return using(this.PagingSelector, this.PagingScopeName).element(lastPageLinkSelector).click();
        }

        public TotalPages():any {
            var totalPagesSelector = '.totalPages';
            return using(this.PagingSelector, this.PagingScopeName).element(totalPagesSelector).text();
        }

        public static Current():PageObjects.FilteredList {
            return new PageObjects.FilteredList();
        }

        public static NavigateToFilteredList(entityName:string):void {
            var url = FilteredList.UrlForEntity(entityName);
            PageObjects.Browser.NavigateTo(url);
        }

        //Urls
        public static UrlForEntity(entityName:string):string {
            return ('/entity/{0}/filteredlist').format([entityName]);
        }
    }
}
