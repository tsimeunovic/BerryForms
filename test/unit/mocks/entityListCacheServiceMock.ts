/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/state/IEntityListCacheService.ts" />

module Mocks {
    'use strict';

    export class EntityListCacheServiceMock implements Services.IEntityListCacheService {
        constructor() {
            this.Setup();
        }

        //Mock members
        public Data:Models.Entity[];

        public InvalidateCache():void {
            //Do nothing
        }

        public LoadData(argument:any):void {
            //Do nothing
        }

        public LoadDataCompleted(data:Models.Entity[], errorsModel:any):void {
            //Do nothing
        }

        public LoadEntityListPage(entitySystemName:string, query:any, pageIndex:number,
                                  callback:(entity:Models.Entity[], query:any, pageIndex:number, totalPages:number, errorsModel:any) => void):void {
            var result:Models.Entity[] = [
                new Models.Entity(entitySystemName),
                new Models.Entity(entitySystemName),
                new Models.Entity(entitySystemName),
                new Models.Entity(entitySystemName),
                new Models.Entity(entitySystemName),
                new Models.Entity(entitySystemName)
            ];
            callback(result, query, pageIndex, 10, null);
        }

        private Setup():void {
            spyOn(this, 'InvalidateCache').and.callThrough();
            spyOn(this, 'LoadData').and.callThrough();
            spyOn(this, 'LoadDataCompleted').and.callThrough();
            spyOn(this, 'LoadEntityListPage').and.callThrough();
        }
    }
}
