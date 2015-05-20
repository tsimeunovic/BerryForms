/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/mapping/IEntityModelMapperService.ts" />

module Mocks {
    'use strict';

    export class EntityModelMapperServiceMock implements Services.IEntityModelMapperService {
        constructor() {
            this.Setup();
        }

        public MapEntityToEntityMetadataModel(entity:Models.Entity):Models.EntityMetadata {
            var metadata:Models.EntityMetadata = new Models.EntityMetadata();
            metadata.EntitySystemName = 'MappedMetadataFromEntity';
            return metadata;
        }

        public MapFieldsMetadataToEntityModels(fieldsMetadata:Models.FieldMetadata[]):Models.Entity[] {
            var result:Models.Entity[] = [];
            for (var i:number = 0; i < fieldsMetadata.length; i++) {
                result.push(new Models.Entity('EntityModelMapperServiceMockEntity'));
            }
            return result;
        }

        public MapEntityModelToFieldMetadata(entity:Models.Entity):Models.FieldMetadata {
            var mockResult:Models.FieldMetadata = new Models.FieldMetadata('EntityModelMapperServiceMockFieldMetadata');
            mockResult.FieldSystemName = 'EntityModelMapperServiceMockFieldMetadata';
            return mockResult;
        }

        public DeserializeEntityMetadataModel(entityMetadataJson:any):Models.EntityMetadata {
            var result:Models.EntityMetadata = new Models.EntityMetadata();
            result.EntityName = 'MockMetadata';
            return result;
        }

        public DeserializeEntityModel(entityJson:any):Models.Entity {
            return new Models.Entity('EntityModelMapperServiceMockEntity');
        }

        public CloneEntityModel(entity:Models.Entity):Models.Entity {
            return new Models.Entity('EntityModelMapperServiceMockEntity');
        }

        public GetIntegerFromStringProperty(sourceObject:any, propertyName:string):number {
            return 12;
        }

        public GetSelectFieldOptionFromEntityJson(entityJson:any, entityMetadata:Models.EntityMetadata):Models.SelectFieldOptionMetadata {
            return new Models.SelectFieldOptionMetadata('MockText', 'MockValue');
        }

        public GetSelectFieldOptionFromStringProperty(sourceObject:any, propertyName:string):Models.SelectFieldOptionMetadata {
            return new Models.SelectFieldOptionMetadata('MockText', 'MockValue');
        }

        public GetSelectFieldOptionsFromArrayProperty(sourceObject:any, propertyName:string):Models.SelectFieldOptionMetadata[] {
            return [
                new Models.SelectFieldOptionMetadata('MockText1', 'MockValue1'),
                new Models.SelectFieldOptionMetadata('MockText2', 'MockValue2')
            ];
        }

        private Setup():void {
            spyOn(this, 'MapEntityToEntityMetadataModel').and.callThrough();
            spyOn(this, 'MapFieldsMetadataToEntityModels').and.callThrough();
            spyOn(this, 'MapEntityModelToFieldMetadata').and.callThrough();
            spyOn(this, 'DeserializeEntityMetadataModel').and.callThrough();
            spyOn(this, 'DeserializeEntityModel').and.callThrough();
            spyOn(this, 'CloneEntityModel').and.callThrough();
            spyOn(this, 'GetIntegerFromStringProperty').and.callThrough();
            spyOn(this, 'GetSelectFieldOptionFromEntityJson').and.callThrough();
            spyOn(this, 'GetSelectFieldOptionFromStringProperty').and.callThrough();
            spyOn(this, 'GetSelectFieldOptionsFromArrayProperty').and.callThrough();
        }
    }
}
