/// <reference path="../../../models/core/fieldMetadataModel.ts" />

module Models {
    'use strict';

    export class BooleanFieldMetadata extends FieldMetadata {
        constructor() {
            super('Boolean');
        }

        public ThreeState: boolean;

        //Mapping
        public FieldSpecialProperties:string[] = ['ThreeState'];
        public MapAdditionalProperties(entity:Models.Entity, mapperService:Services.IEntityModelMapperService):void {
            //No additional properties
        }
    }
}
