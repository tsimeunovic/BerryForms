/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/system/IRedirectService.ts" />
/// <reference path="../../../client/extensions/stringExtensions.ts" />

'use strict';

module Mocks {
    export class RedirectServiceMock implements Services.IRedirectService {
        constructor() {
            this.Setup();
        }

        private Setup():void {
            spyOn(this, 'GetEditEntityUrl').and.callThrough();
            spyOn(this, 'RedirectToCreateEntitySchema').and.callThrough();
            spyOn(this, 'RedirectToEditEntitySchema').and.callThrough();
            spyOn(this, 'RedirectToCreateEntity').and.callThrough();
            spyOn(this, 'RedirectToEditEntity').and.callThrough();
            spyOn(this, 'RedirectToEntityPage').and.callThrough();
            spyOn(this, 'RedirectToFilteredList').and.callThrough();
        }

        //Mock members
        public GetEditEntityUrl(entityName:string, entityId:number):string {
            return ('mockEditEntityUrl/{0}/{1}').format([entityName, entityId.toString()]);
        }
        public RedirectToCreateEntitySchema():void {}
        public RedirectToEditEntitySchema(entityName:string):void {}
        public RedirectToCreateEntity(entityName:string):void {}
        public RedirectToEditEntity(entityName:string, entityId:number):void {}
        public RedirectToEntityPage(entityName:string, entityId:number, pageNumber:number):void {}
        public RedirectToFilteredList(entityName:string, filterQs:string, pageNumber:number):void {}
    }
}
