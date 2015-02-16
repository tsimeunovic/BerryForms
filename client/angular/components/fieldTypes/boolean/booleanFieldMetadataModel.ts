/// <reference path="../../../models/core/fieldMetadataModel.ts" />

'use strict';

module Models {
    export class BooleanFieldMetadata extends FieldMetadata {
        constructor() {
            super("Boolean");
        }

        public ThreeState: boolean;

        //Mapping
        public FieldSpecialProperties:string[] = ['ThreeState'];
        public MapAdditionalProperties(entity:Models.Entity, mapperService:Services.IEntityModelMapperService):void {
        }
    }
}