/// <reference path="../../interfaces/services/security/IPermissionService.ts" />
/// <reference path="../../interfaces/services/state/IStateService.ts" />

//Service that contains logic related to permissions. Decides whether user can perform an action or not
module Services {
    'use strict';

    export class PermissionService implements Services.IPermissionService {
        //@ngInject
        constructor(private StateService:Services.IStateService) {
        }

        public UserCanPerformGlobalAction(action:string):boolean {
            //Retrieve user
            var session:Models.UserSession = this.StateService.GetCurrentUserSession();
            if (!session || !session.User) {
                return false;
            } else if (session.User.IsSuperUser) {
                return true;
            }

            //Check permission on user level
            var actionPermissionPredicate:(p:Models.Permission) => boolean = function (permission:Models.Permission):boolean {
                return permission.Action === action;
            };
            var actionUserPermission:Models.Permission = session.User.ApplicationPermissions.single(actionPermissionPredicate);
            if (actionUserPermission != null) {
                return actionUserPermission.Allow;
            }

            //Check permissions on role level
            var actionAllowPermissionPredicate:(p:Models.Permission) => boolean = function (permission:Models.Permission):boolean {
                return permission.Action === action && permission.Allow;
            };
            for (var i:number = 0; i < session.User.Roles.length; i++) {
                //Try to find any role with allow permission
                var role:Models.SecurityRole = session.User.Roles[i];
                var actionRolePermission:Models.Permission = role.ApplicationPermissions.first(actionAllowPermissionPredicate);
                if (actionRolePermission !== null) {
                    return actionRolePermission.Allow;
                }
            }

            //No permission for this action found
            return false;
        }

        public UserCanPerformObjectAction(action:string, object:Models.IPermissionObject):boolean {
            //Retrieve user
            var session:Models.UserSession = this.StateService.GetCurrentUserSession();
            if (!session || !session.User) {
                return false;
            } else if (session.User.IsSuperUser) {
                return true;
            }

            //Find action in object permissions
            var actionPermissionPredicate:(p:Models.Permission) => boolean = function (permission:Models.CascadingPermission):boolean {
                return permission.Action === action;
            };
            var actionObjectPermission:Models.CascadingPermission = object.Permissions.single(actionPermissionPredicate);
            if (!actionObjectPermission) {
                //Action not defined on object
                return false;
            }

            //Check permissions on user level
            var userPermission:boolean = this.CheckUserPermission(action, session.User.UserName, actionObjectPermission);
            if (userPermission !== null) {
                return userPermission;
            }

            //Check permissions on role level
            var mapRoleFunction:(r:Models.SecurityRole) => string = function (role:Models.SecurityRole):string {
                return role.RoleName;
            };
            var userRoles:string[] = session.User.Roles.map(mapRoleFunction);
            var rolePermission:boolean = this.CheckRolesPermission(action, userRoles, actionObjectPermission);
            if (rolePermission !== null) {
                return rolePermission;
            }

            //Check default permission
            return actionObjectPermission.Allow;
        }

        private CheckUserPermission(action:string, userName:string, permission:Models.CascadingPermission):boolean {
            var userPredicate:(p:string) => boolean = function (permissionUser:string):boolean {
                return permissionUser === userName;
            };

            //Check for permission set for this user
            var allowRecord:string = permission.AllowUsers.single(userPredicate);
            var denyRecord:string = permission.DenyUsers.single(userPredicate);
            if (allowRecord) {
                return true;
            } else if (denyRecord) {
                return false;
            }

            //No record found
            return null;
        }

        private CheckRolesPermission(action:string, userRoles:string[], permission:Models.CascadingPermission):boolean {
            var rolePredicate:(r:string) => boolean = function (roleName:string):boolean {
                return userRoles.contains(roleName);
            };

            //Check for permission set for one of user roles
            var allowRecord:string = permission.AllowRoles.first(rolePredicate);
            var denyRecord:string = permission.DenyRoles.first(rolePredicate);
            if (allowRecord.length > 0) {
                return true;
            } else if (denyRecord.length > 0) {
                return false;
            }

            //No record found
            return null;
        }
    }
}
