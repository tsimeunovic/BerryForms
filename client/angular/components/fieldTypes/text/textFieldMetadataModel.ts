/// <reference path="../../../../extensions/stringExtensions.ts" />
/// <reference path="../../../models/core/fieldMetadataModel.ts" />

module Models {
    'use strict';

    export class TextFieldMetadata extends FieldMetadata {
        constructor() {
            super('Text');
        }

        public RegularExpression:string;
        public MaxLength:number;
        public MaskCharacters:boolean;
        public Symbol:string;

        //Mapping
        public FieldSpecialProperties:string[] = ['MaxLength', 'RegularExpression', 'MaskCharacters'];

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

            //Regex
            var regExp:RegExp = new RegExp(this.RegularExpression, 'i');
            if (value && !regExp.test(value)) {
                return false;
            }

            return true;
        }
    }
}
