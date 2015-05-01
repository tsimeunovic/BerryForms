/// <reference path="../../../../extensions/stringExtensions.ts" />
/// <reference path="../../../models/core/fieldMetadataModel.ts" />

module Models {
    'use strict';

    export class TextareaFieldMetadata extends FieldMetadata {
        constructor() {
            super('Textarea');
        }

        public MaxLength:number;

        //Mapping
        public FieldSpecialProperties:string[] = ['MaxLength'];

        public MapAdditionalProperties(entity:Models.Entity, mapperService:Services.IEntityModelMapperService):void {
            //No additional properties
        }

        //Validation
        public ValidateValue(value:any):boolean {
            //Required
            var requiredValid:boolean = super.ValidateValue(value);
            if (!requiredValid) {
                return false;
            }

            //System keyword
            if (value != null && value.startsWith(Config.Client.SystemPrefix)) {
                return false;
            }

            //MaxLength
            if (this.MaxLength && value && this.MaxLength < value.length) {
                return false;
            }

            return true;
        }
    }
}
