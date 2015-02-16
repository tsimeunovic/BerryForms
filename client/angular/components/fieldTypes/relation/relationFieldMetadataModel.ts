/// <reference path="../../../models/core/fieldMetadataModel.ts" />

'use strict';

module Models {
    export class RelationFieldMetadata extends FieldMetadata {
        constructor() {
            super("Relation");
        }

        public RelatedEntity: Models.SelectFieldOptionMetadata;

        //Mapping
        public FieldSpecialProperties:string[] = ['RelatedEntity'];
        public MapAdditionalProperties(entity:Models.Entity, mapperService:Services.IEntityModelMapperService):void {
        }
    }
}