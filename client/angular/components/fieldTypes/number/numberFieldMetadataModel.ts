/// <reference path="../../../../extensions/stringExtensions.ts" />
/// <reference path="../../../models/core/fieldMetadataModel.ts" />

'use strict';

module Models {
    export class NumberFieldMetadata extends FieldMetadata {
        constructor() {
            super("Number");
        }

        public AllowFloating:boolean;
        public MinValue:number;
        public MaxValue:number;

        public ValidateValue(value:any):boolean {
            //Required
            var requiredValid = super.ValidateValue(value);
            if (!requiredValid) return false;
            if (!value) return true;

            //Valid number
            if (isNaN(value)) return false;

            //Allow floating
            if (value % 1 !== 0 && !this.AllowFloating) return false;

            //Min and Max
            if (value < this.MinValue) return false;
            if (value > this.MaxValue) return false;

            return true;
        }

        //Mapping
        public FieldSpecialProperties:string[] = ['AllowFloating', 'MinValue', 'MaxValue'];

        public MapAdditionalProperties(entity:Models.Entity, mapperService:Services.IEntityModelMapperService):void {
        }
    }
}
