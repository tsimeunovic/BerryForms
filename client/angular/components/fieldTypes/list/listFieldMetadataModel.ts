/// <reference path="../../../../extensions/stringExtensions.ts" />
/// <reference path="../../../models/fieldMetadataModel.ts" />

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
        public FieldSpecialProperties:string[] = [];
        public MapAdditionalProperties(entity:Models.Entity, mapperService:Services.IEntityModelMapperService):void {
            //Map from entity (when loading from server) to metadata and vice-versa (when saving to server)
            if(this.MaxRecordsCount) entity.Data['MaxRecordsCount'] = this.MaxRecordsCount.toString();
            else this.MaxRecordsCount = mapperService.GetIntegerFromStringProperty(entity.Data, 'MaxRecordsCount');

            if(this.MaxRecordLength) entity.Data['MaxRecordLength'] = this.MaxRecordLength.toString();
            this.MaxRecordLength = mapperService.GetIntegerFromStringProperty(entity.Data, 'MaxRecordLength');
        }
    }
}
