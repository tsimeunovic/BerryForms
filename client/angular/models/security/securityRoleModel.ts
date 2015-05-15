/// <reference path="../security/permissionModel.ts" />

//Represents application role
module Models {
    'use strict';

    export class SecurityRole {
        public RoleName:string;
        public ApplicationPermissions:Models.Permission[];
    }
}
