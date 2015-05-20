/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/state/IEntityMetadataListCacheService.ts" />

module Mocks {
    'use strict';

    export class EntityMetadataListCacheServiceMock implements Services.IEntityMetadataListCacheService {
        constructor() {
            this.Setup();
        }

        //Mock members
        public Data:Models.EntityMetadata[];

        private LoadEntityMetadataFromCacheResponse:Models.EntityMetadata;

        public SetMetadataCache(data:Models.EntityMetadata[]):void {
            this.Data = data;
        }

        public SetLoadEntityMetadataFromCacheResponse(entityMetadata:Models.EntityMetadata):void {
            this.LoadEntityMetadataFromCacheResponse = entityMetadata;
        }

        public InvalidateCache():void {
            //Do nothing
        }

        public LoadData(argument:any):void {
            //Do nothing
        }

        public LoadDataCompleted(data:Models.EntityMetadata[], errorsModel:any):void {
            //Do nothing
        }

        public LoadEntityMetadataFromCache(entitySystemName:string,
                                           callback:(entityMetadata:Models.EntityMetadata, errorsModel:any) => void):void {
            var defaultResponse:Models.EntityMetadata = new Models.EntityMetadata();
            defaultResponse.EntityName = entitySystemName;
            defaultResponse.EntitySystemName = entitySystemName;
            callback(this.LoadEntityMetadataFromCacheResponse || defaultResponse, null);
        }

        private Setup():void {
            spyOn(this, 'InvalidateCache').and.callThrough();
            spyOn(this, 'LoadData').and.callThrough();
            spyOn(this, 'LoadDataCompleted').and.callThrough();
            spyOn(this, 'LoadEntityMetadataFromCache').and.callThrough();
        }
    }
}
