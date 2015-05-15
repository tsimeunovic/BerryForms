//Interface for Redirect service (used to switch views across application)
module Services {
    'use strict';

    export interface IRedirectService {
        //Urls
        GetEditEntityUrl(entityName:string, entityId:number):string;

        //Redirects
        RedirectToHomeScreen():void;
        RedirectToCreateEntitySchema():void;
        RedirectToEditEntitySchema(entityName:string):void;
        RedirectToCreateEntity(entityName:string):void;
        RedirectToEditEntity(entityName:string, entityId:number):void;
        RedirectToEntityPage(entityName:string, entityId:number, pageNumber:number):void;
        RedirectToFilteredList(entityName:string, filterQs:string, pageNumber:number):void;
    }
}
