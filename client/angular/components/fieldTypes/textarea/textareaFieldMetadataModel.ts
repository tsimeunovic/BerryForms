/// <reference path="../../../../extensions/stringExtensions.ts" />
/// <reference path="../../../models/core/fieldMetadataModel.ts" />

'use strict';

module Models {
    export class TextareaFieldMetadata extends FieldMetadata {
        constructor() {
            super("Textarea");
        }

        public MaxLength: number;

        public ValidateValue(value:any):boolean {
            //Required
            var requiredValid = super.ValidateValue(value);
            if(!requiredValid) return false;

            //System keyword
            if(value != null && value.startsWith(Config.Client.SystemPrefix)) return false;

            //MaxLength
            if(this.MaxLength && value && this.MaxLength < value.length) return false;

            return true;
        }

        //Mapping
        public FieldSpecialProperties:string[] = [];
        public MapAdditionalProperties(entity:Models.Entity, mapperService:Services.IEntityModelMapperService):void {
            //Map from entity to model and vice-versa
            if(this.MaxLength) entity.Data['MaxLength'] = this.MaxLength.toString();
            else this.MaxLength = mapperService.GetIntegerFromStringProperty(entity.Data, 'MaxLength');
        }
    }
}
