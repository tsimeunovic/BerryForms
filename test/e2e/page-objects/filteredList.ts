/// <reference path="./browser.ts" />
/// <reference path="./form.ts" />
/// <reference path="./loginDialog.ts" />
/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/extensions/stringExtensions.ts" />

module PageObjects {
    'use strict';

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

        public static Current():PageObjects.FilteredList {
            return new PageObjects.FilteredList();
        }

        public static NavigateToFilteredList(entityName:string):void {
            var url:string = FilteredList.UrlForEntity(entityName);
            PageObjects.Browser.NavigateTo(url);
        }

        public static NavigateToFilteredListWithLogin(entityName:string):void {
            this.NavigateToFilteredList(entityName);
            var loginDialog:PageObjects.LoginDialog = PageObjects.LoginDialog.Current();
            loginDialog.LoginAsDefault();
        }

        //Urls
        public static UrlForEntity(entityName:string):string {
            return ('/entity/{0}/filteredlist').format([entityName]);
        }

        //List methods
        public GetListItems():any {
            var filteredListItemSelector:string = '.entityRecord';
            return using(this.FilteredListSelector, this.FilteredListScopeName).element(filteredListItemSelector);
        }

        public ToggleExpand():void {
            var toggleButtonSelector:string = '.filterControls .control .glyphicon-filter';
            using(this.FilterSelector, this.FilterScopeName).element(toggleButtonSelector).click();
        }

        public ApplyFilterObject(filterObject:any):void {
            this.FilterForm.Fill(filterObject);
            var applyFilterButtonSelector:string = '.filterControls .control .glyphicon-search';
            using(this.FilterSelector, this.FilterScopeName).element(applyFilterButtonSelector).click();
        }

        public GoToFirstPage():void {
            var firstPageLinkSelector:string = 'a.first';
            return using(this.PagingSelector, this.PagingScopeName).element(firstPageLinkSelector).click();
        }

        public GoToPreviousPage():void {
            var previousPageLinkSelector:string = 'a.previous';
            return using(this.PagingSelector, this.PagingScopeName).element(previousPageLinkSelector).click();
        }

        public GoToNextPage():void {
            var nextPageLinkSelector:string = 'a.next';
            return using(this.PagingSelector, this.PagingScopeName).element(nextPageLinkSelector).click();
        }

        public GoToLastPage():void {
            var lastPageLinkSelector:string = 'a.last';
            return using(this.PagingSelector, this.PagingScopeName).element(lastPageLinkSelector).click();
        }

        public TotalPages():any {
            var totalPagesSelector:string = '.totalPages';
            return using(this.PagingSelector, this.PagingScopeName).element(totalPagesSelector).text();
        }
    }
}
