/// <reference path="../security/permissionModel.ts" />

'use strict';

//Represents application role
module Models {
    export class SecurityRole {
        public RoleName:string;
        public ApplicationPermissions:Models.Permission[];
    }
}
