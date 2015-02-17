/// <reference path="../security/permissionModel.ts" />
/// <reference path="../security/securityRoleModel.ts" />

'use strict';

//Represents application user
module Models {
    export class User {
        //Identifier
        public UserName:string;

        //Personal data
        public FirstName:string;
        public LastName:string;

        //User roles
        public IsSuperUser:boolean;
        public Roles:Models.SecurityRole[];

        //User specific permissions
        public ApplicationPermissions:Models.Permission[];

        //User settings
        //public Setting:any;
    }
}
