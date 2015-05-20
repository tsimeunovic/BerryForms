/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/system/IRedirectService.ts" />
/// <reference path="../../../client/extensions/stringExtensions.ts" />

module Mocks {
    'use strict';

    export class RedirectServiceMock implements Services.IRedirectService {
        constructor() {
            this.Setup();
        }

        //Mock members
        public GetEditEntityUrl(entityName:string, entityId:number):string {
            return ('mockEditEntityUrl/{0}/{1}').format([entityName, entityId.toString()]);
        }

        public RedirectToCreateEntitySchema():void {
            //Do nothing
        }

        public RedirectToEditEntitySchema(entityName:string):void {
            //Do nothing
        }

        public RedirectToCreateEntity(entityName:string):void {
            //Do nothing
        }

        public RedirectToEditEntity(entityName:string, entityId:number):void {
            //Do nothing
        }

        public RedirectToEntityPage(entityName:string, entityId:number, pageNumber:number):void {
            //Do nothing
        }

        public RedirectToFilteredList(entityName:string, filterQs:string, pageNumber:number):void {
            //Do nothing
        }

        public RedirectToHomeScreen():void {
            //Do nothing
        }

        private Setup():void {
            spyOn(this, 'GetEditEntityUrl').and.callThrough();
            spyOn(this, 'RedirectToCreateEntitySchema').and.callThrough();
            spyOn(this, 'RedirectToEditEntitySchema').and.callThrough();
            spyOn(this, 'RedirectToCreateEntity').and.callThrough();
            spyOn(this, 'RedirectToEditEntity').and.callThrough();
            spyOn(this, 'RedirectToEntityPage').and.callThrough();
            spyOn(this, 'RedirectToFilteredList').and.callThrough();
            spyOn(this, 'RedirectToHomeScreen').and.callThrough();
        }
    }
}
