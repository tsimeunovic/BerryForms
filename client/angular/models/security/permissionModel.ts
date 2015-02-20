'use strict';

//Represents permission for action
module Models {
    export class Permission {
        //Underlying action
        public Action:string;

        //True = Allow, False = Deny
        public Allow:boolean;
    }

    export class CascadingPermission extends Permission {
        constructor() {
            super();
            this.AllowRoles = [];
            this.DenyRoles = [];
            this.AllowUsers = [];
            this.DenyUsers = [];
        }

        //Inherited Allow:boolean is used as default value

        //Roles permission overrides (stronger)
        AllowRoles:string[];
        DenyRoles:string[];

        //Users permission overrides (strongest)
        AllowUsers:string[];
        DenyUsers:string[];
    }
}
