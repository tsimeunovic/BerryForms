'use strict';

//Interface for Url locator service (resolves urls for all Node api calls)
module Services {
    export interface IUrlLocatorService {
        //Rest API
        //Entities
        GetUrlForEntityMetadataListRetrieve():string;
        GetUrlForEntityMetadataRetrieve(entityName:string):string;
        GetUrlForEntityMetadataSave(entityName:string):string;

        GetUrlForEntityListRetrieve(entityName:string):string;
        GetUrlForPagedEntityListRetrieve(entityName:string, pageNumber:number, pageSize:number):string;
        GetUrlForFilteredListRetrieve(entityName:string, pageNumber:number, pageSize:number):string;
        GetUrlForEntityRetrieve(entityName:string, entityId:number):string;
        GetUrlForEntitySave(entityName:string):string;
        GetUrlForEntityDelete(entityName:string, entityId:number):string;

        //User
        GetUrlForLogin():string;

        //Dashboard
        GetUrlForDashboardActivitySummary(entityName:string):string;
    }
}
