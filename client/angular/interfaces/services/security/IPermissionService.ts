/// <reference path="../../../models/security/permissionModel.ts" />

'use strict';

//Interface for Permission service (service deciding whether user can perform give action)
module Services {
    export interface IPermissionService {
        UserCanPerformGlobalAction(action:string):boolean;
        UserCanPerformObjectAction(action:string, object:Models.IPermissionObject):boolean;
    }
}