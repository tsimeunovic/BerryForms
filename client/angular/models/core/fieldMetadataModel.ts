/// <reference path="../../interfaces/services/mapping/IEntityModelMapperService.ts" />
/// <reference path="../../../config/configHelper.ts" />

//Model representing field in entity type
module Models {
    'use strict';

    export class FieldMetadata {
        constructor(fieldTypeName:string) {
            this.FieldTypeName = fieldTypeName;
            this.Configuration = ConfigHelper.Client.GetFieldsConfigurationFor(fieldTypeName);
        }

        public FieldTypeName:string;

        //Name and description
        public FieldName:string;
        public FieldSystemName:string;
        public FieldDescription:string;

        //ReadOnly
        public ReadOnly:boolean;

        //Display in list
        public DisplayInListName:boolean;

        //Validation
        public Required:boolean;

        //Configuration
        public Configuration:any;

        //Events
        public ValueChanged:(value:any, valid:boolean) => void;

        //Mapping
        public FieldSpecialProperties:string[] = [];

        public MapAdditionalProperties(entity:Models.Entity, mapperService:Services.IEntityModelMapperService):void {
            throw new Error();
        }

        //Validation
        public ValidateValue(value:any):boolean {
            //Common implementation
            var hasValidValue:boolean = value != null &&
                value.length !== 0 &&
                value.Value !== '';
            return !this.Required || hasValidValue;
        }
    }
}
