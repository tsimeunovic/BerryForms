/// <reference path="../../../../extensions/stringExtensions.ts" />
/// <reference path="../../../models/core/fieldMetadataModel.ts" />

'use strict';

module Models {
    export class ListFieldMetadata extends FieldMetadata {
        constructor() {
            super("List");
        }

        public MaxRecordsCount: number;
        public MaxRecordLength: number;

        public ValidateValue(value:any):boolean {
            //Required
            var itemsCount = value ? value.length : 0;
            var hasItems = itemsCount > 0;
            if(this.Required && !hasItems) return false;

            //Records count and length
            if(itemsCount > this.MaxRecordsCount) return false;
            for(var index = 0;index < itemsCount;index++)
            {
                //Record max length
                if(value[index].length > (this.MaxRecordLength || 1024)) return false;
                //System keyword
                if(value[index].startsWith(Config.Client.SystemPrefix)) return false;
            }

            //Everything valid
            return true;
        }

        //Mapping
        public FieldSpecialProperties:string[] = ['MaxRecordsCount', 'MaxRecordLength'];
        public MapAdditionalProperties(entity:Models.Entity, mapperService:Services.IEntityModelMapperService):void {
        }
    }
}
