/// <reference path="../../models/security/permissionModel.ts" />

//Interface for any object that can restrict access to its actions
module Models {
    'use strict';

    export interface IPermissionObject {
        Permissions:Models.CascadingPermission[];
    }
}
