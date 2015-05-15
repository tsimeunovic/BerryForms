/// <reference path="../../../models/security/permissionModel.ts" />
/// <reference path="../../../interfaces/models/IPermissionObject.ts" />

//Interface for Permission service (service deciding whether user can perform give action)
module Services {
    'use strict';

    export interface IPermissionService {
        UserCanPerformGlobalAction(action:string):boolean;
        UserCanPerformObjectAction(action:string, object:Models.IPermissionObject):boolean;
    }
}
