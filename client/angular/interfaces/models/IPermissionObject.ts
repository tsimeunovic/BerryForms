'use strict';

//Interface for any object that can restrict access to its actions
module Models {
    export interface IPermissionObject {
        Permissions:Models.CascadingPermission[];
    }
}