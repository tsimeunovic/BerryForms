/// <reference path="../Models/fieldMetadataModel.ts" />

'use strict';

//Model representing entity type
module Models {
    export class EntityMetadata {
        constructor() {
            this.Fields = [];
        }

        //Name and description
        public Id:number; //Set externally
        public EntityName:string;
        public EntitySystemName:string;
        public EntityDescription:string;

        public CreatedDate:Date;
        public ModifiedDate:Date;

        //Icon
        public IconClassName:string;
        public IconColorHex:string;

        //Entity fields
        public Fields:Models.FieldMetadata[];
    }
}
