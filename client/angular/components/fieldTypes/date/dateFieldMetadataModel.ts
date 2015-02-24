/// <reference path="../../../models/core/fieldMetadataModel.ts" />
/// <reference path="../../../../config/config.ts" />

'use strict';

module Models {
    export class DateFieldMetadata extends FieldMetadata {
        constructor() {
            super("Date");
        }

        public MinDate:number;
        public MaxDate:number;

        public ValidateValue(value:any):boolean {
            //Required
            var requiredValid = super.ValidateValue(value);
            if(!requiredValid) return false;

            //Min and Max date
            if(!value) return true;
            else if(this.MinDate && this.MinDate > value) return false;
            else if(this.MaxDate && this.MaxDate < value) return false;

            return true;
        }

        //Mapping
        public FieldSpecialProperties:string[] = ['MinDate', 'MaxDate'];
        public MapAdditionalProperties(entity:Models.Entity, mapperService:Services.IEntityModelMapperService):void {
        }
    }
}
