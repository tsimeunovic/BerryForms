/// <reference path="../security/permissionModel.ts" />
/// <reference path="../security/securityRoleModel.ts" />

//Represents application user
module Models {
    'use strict';

    export class User {
        constructor() {
            this.Roles = [];
            this.ApplicationPermissions = [];
        }

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
        public Setting:any;
    }
}
