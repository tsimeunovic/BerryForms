/// <reference path="../../../../extensions/stringExtensions.ts" />
/// <reference path="../../../models/fieldMetadataModel.ts" />

'use strict';

module Models {
    export class TextFieldMetadata extends FieldMetadata {
        constructor() {
            super("Text");
        }

        public RegularExpression:string;
        public MaxLength:number;

        public ValidateValue(value:any):boolean {
            //Required
            var requiredValid = super.ValidateValue(value);
            if (!requiredValid) return false;

            //System keyword
            if (value != null && value.startsWith(Config.Client.SystemPrefix)) return false;

            //MaxLength
            if (this.MaxLength && value && this.MaxLength < value.length) return false;

            //Regex
            var regExp = new RegExp(this.RegularExpression, 'i');
            if (value && !regExp.test(value)) return false;

            return true;
        }

        //Mapping
        public FieldSpecialProperties:string[] = ['RegularExpression'];
        public MapAdditionalProperties(entity:Models.Entity, mapperService:Services.IEntityModelMapperService):void {
            //Map from entity (when loading from server) to metadata and vice-versa (when saving to server)
            if(this.MaxLength) entity.Data['MaxLength'] = this.MaxLength.toString();
            else this.MaxLength = mapperService.GetIntegerFromStringProperty(entity.Data, 'MaxLength');
        }
    }
}
