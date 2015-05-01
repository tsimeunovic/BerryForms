/// <reference path="../../../../extensions/stringExtensions.ts" />
/// <reference path="../../../models/core/fieldMetadataModel.ts" />

module Models {
    'use strict';

    export class ListFieldMetadata extends FieldMetadata {
        constructor() {
            super('List');
        }

        public MaxRecordsCount:number;
        public MaxRecordLength:number;

        //Mapping
        public FieldSpecialProperties:string[] = ['MaxRecordsCount', 'MaxRecordLength'];

        public MapAdditionalProperties(entity:Models.Entity, mapperService:Services.IEntityModelMapperService):void {
            //No additional properties
        }

        //Validation
        public ValidateValue(value:any):boolean {
            //Required
            var itemsCount:number = value ? value.length : 0;
            var hasItems:boolean = itemsCount > 0;
            if (this.Required && !hasItems) {
                return false;
            }

            //Records count and length
            if (itemsCount > this.MaxRecordsCount) {
                return false;
            }
            for (var index:number = 0; index < itemsCount; index++) {
                //Record max length
                if (value[index].length > (this.MaxRecordLength || 1024)) {
                    return false;
                }
                //System keyword
                if (value[index].startsWith(Config.Client.SystemPrefix)) {
                    return false;
                }
            }

            //Everything valid
            return true;
        }
    }
}
