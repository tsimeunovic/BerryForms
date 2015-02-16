/// <reference path="fieldMetadataModel.ts" />

'use strict';

//Model representing entity type
module Models {
    export class EntityMetadata {
        constructor() {
            this.Fields = [];
            this.Permissions = [];
        }

        //Name and description
        public Id:number; //Set externally
        public EntityName:string;
        public EntitySystemName:string;
        public EntityDescription:string;

        //Created and modified info (set on server)
        public CreatedDate:Date;
        public CreatedBy:string;
        public ModifiedDate:Date;
        public ModifiedBy:string;

        //Icon
        public IconClassName:string;
        public IconColorHex:string;

        //Entity fields
        public Fields:Models.FieldMetadata[];

        //Permissions
        public Permissions:Models.CascadingPermission[];
    }
}
