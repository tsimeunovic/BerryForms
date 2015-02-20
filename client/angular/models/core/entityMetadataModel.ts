/// <reference path="persistentObject.ts" />
/// <reference path="../core/fieldMetadataModel.ts" />
/// <reference path="../security/permissionModel.ts" />
/// <reference path="../../interfaces/models/IPermissionObject.ts" />

'use strict';

//Model representing entity type
module Models {
    export class EntityMetadata extends PersistentObject implements Models.IPermissionObject {
        constructor() {
            super();
            this.Fields = [];
            this.Permissions = [];
        }

        //Name and description
        public EntityName:string;
        public EntitySystemName:string;
        public EntityDescription:string;

        //Icon
        public IconClassName:string;
        public IconColorHex:string;

        //Entity fields
        public Fields:Models.FieldMetadata[];

        //Permissions
        public Permissions:Models.CascadingPermission[];
    }
}
