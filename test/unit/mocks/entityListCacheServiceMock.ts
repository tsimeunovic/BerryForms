/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/state/IEntityListCacheService.ts" />

'use strict';

module Mocks {
    export class EntityListCacheServiceMock implements Services.IEntityListCacheService {
        constructor() {
            this.Setup();
        }

        private Setup() {
            spyOn(this, 'InvalidateCache').and.callThrough();
            spyOn(this, 'LoadData').and.callThrough();
            spyOn(this, 'LoadDataCompleted').and.callThrough();
            spyOn(this, 'LoadEntityListPage').and.callThrough();
        }

        //Mock members
        public Data:Models.Entity[];
        public InvalidateCache():void {}
        public LoadData(argument:any):void {}
        public LoadDataCompleted(data:Models.Entity[], errorsModel:any):void {}
        public LoadEntityListPage(entitySystemName:string, query:any, pageIndex:number, callback:(entity:Models.Entity[], query:any, pageIndex:number, totalPages:number, errorsModel:any)=>void):void {
            var result = [
                new Models.Entity(entitySystemName),
                new Models.Entity(entitySystemName),
                new Models.Entity(entitySystemName),
                new Models.Entity(entitySystemName),
                new Models.Entity(entitySystemName),
                new Models.Entity(entitySystemName)
            ];
            callback(result, query, pageIndex, 10, null);
        }
    }
}
