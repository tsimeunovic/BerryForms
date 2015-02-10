/// <reference path="./browser.ts" />

'use strict';

module PageObjects {
    export class EntitySchemaForm {
        //Navigation
        public static CreateEntityUrlPattern:string = '/schema/entity';
        public static NavigateToCreate():void {
            var url = '/schema/entity';
            PageObjects.Browser.NavigateTo(url);
        }

        public static NavigateToEdit(entityName:string):void {
            var url = EntitySchemaForm.UrlForSchemaEdit(entityName);
            PageObjects.Browser.NavigateTo(url);
        }

        //Urls
        public static UrlForSchemaEdit(entityName:string):string {
            return '/schema/entity/' + entityName
        }
    }
}
