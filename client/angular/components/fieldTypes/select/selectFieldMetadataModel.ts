/// <reference path="./selectFieldOptionMetadataModel.ts" />
/// <reference path="../../../models/core/fieldMetadataModel.ts" />

module Models {
    'use strict';

    export class SelectFieldMetadata extends FieldMetadata {
        constructor() {
            super('Select');
        }

        public Values:Models.SelectFieldOptionMetadata[];
        public DefaultValue:Models.SelectFieldOptionMetadata; //If null, then "Please select value ..." is added

        //Mapping
        public FieldSpecialProperties:string[] = [];

        public MapAdditionalProperties(entity:Models.Entity, mapperService:Services.IEntityModelMapperService):void {
            //Map from entity (when loading from server) to metadata and vice-versa (when saving to server)
            if (this.Values) {
                entity.Data.Values = this.Values.map(function (item:Models.SelectFieldOptionMetadata):string {
                    return item.Text;
                });
            } else {
                this.Values = mapperService.GetSelectFieldOptionsFromArrayProperty(entity.Data, 'Values');
            }

            if (this.DefaultValue) {
                entity.Data.DefaultValue = this.DefaultValue.Text;
            } else {
                this.DefaultValue = mapperService.GetSelectFieldOptionFromStringProperty(entity.Data, 'DefaultValue');
            }
        }
    }
}
