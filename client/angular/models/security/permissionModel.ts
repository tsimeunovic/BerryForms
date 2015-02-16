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
            this.AllowGroups = [];
            this.DenyGroups = [];
            this.AllowUsers = [];
            this.DenyUsers = [];
        }

        //Inherited Allow:boolean is used as default value

        //Groups permission overrides
        AllowGroups:string[];
        DenyGroups:string[];

        //Users permission overrides
        AllowUsers:string[];
        DenyUsers:string[];
    }
}
