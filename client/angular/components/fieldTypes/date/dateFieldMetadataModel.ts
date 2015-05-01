/// <reference path="../../../models/core/fieldMetadataModel.ts" />
/// <reference path="../../../../config/config.ts" />

module Models {
    'use strict';

    export class DateFieldMetadata extends FieldMetadata {
        constructor() {
            super('Date');
        }

        public MinDate:number;
        public MaxDate:number;

        //Mapping
        public FieldSpecialProperties:string[] = ['MinDate', 'MaxDate'];

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

            //Min and Max date
            if (!value) {
                return true;
            } else if (this.MinDate && this.MinDate > value) {
                return false;
            } else if (this.MaxDate && this.MaxDate < value) {
                return false;
            }

            return true;
        }
    }
}
