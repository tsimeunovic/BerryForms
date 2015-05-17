/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/state/IEntityMetadataListCacheService.ts" />

'use strict';

module Mocks {
    export class EntityMetadataListCacheServiceMock implements Services.IEntityMetadataListCacheService {
        constructor() {
            this.Setup();
        }

        private Setup() {
            spyOn(this, 'InvalidateCache').and.callThrough();
            spyOn(this, 'LoadData').and.callThrough();
            spyOn(this, 'LoadDataCompleted').and.callThrough();
            spyOn(this, 'LoadEntityMetadataFromCache').and.callThrough();
        }

        private LoadEntityMetadataFromCacheResponse:Models.EntityMetadata;

        public SetMetadataCache(data:Models.EntityMetadata[]){
            this.Data = data;
        }

        public SetLoadEntityMetadataFromCacheResponse(entityMetadata:Models.EntityMetadata) {
            this.LoadEntityMetadataFromCacheResponse = entityMetadata;
        }

        //Mock members
        public Data:Models.EntityMetadata[];
        public InvalidateCache():void {}
        public LoadData(argument:any):void {}
        public LoadDataCompleted(data:Models.EntityMetadata[], errorsModel:any):void {}
        public LoadEntityMetadataFromCache(entitySystemName:string, callback:(entityMetadata:Models.EntityMetadata, errorsModel:any)=>void):void {
            var defaultResponse:Models.EntityMetadata = new Models.EntityMetadata();
            defaultResponse.EntityName = entitySystemName;
            defaultResponse.EntitySystemName = entitySystemName;
            callback(this.LoadEntityMetadataFromCacheResponse || defaultResponse, null);
        }
    }
}
