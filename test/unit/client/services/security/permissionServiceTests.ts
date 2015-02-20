/// <reference path="../../../../../client/angular/services/security/permissionService.ts" />

'use strict';

describe('Service: PermissionService', function () {
    var stateServiceMock:Mocks.StateServiceMock;
    var systemUnderTest:Services.PermissionService;

    beforeEach(function () {
        var defaultSession:Models.UserSession = createDefaultSession();
        stateServiceMock = new Mocks.StateServiceMock();
        stateServiceMock.SetCurrentUserSession(defaultSession);
        systemUnderTest = new Services.PermissionService(stateServiceMock);
    });

    var createDefaultSession = function ():Models.UserSession {
        var defaultSession:Models.UserSession = new Models.UserSession();
        var defaultUser:Models.User = new Models.User();
        defaultSession.User = defaultUser;
        defaultUser.UserName = 'TestUser';

        //Permissions
        var userPermission1 = new Models.Permission();
        userPermission1.Action = 'Action2';
        userPermission1.Allow = true;
        var userPermission2 = new Models.Permission();
        userPermission2.Action = 'Action3';
        userPermission2.Allow = false;
        var userPermission3 = new Models.Permission();
        userPermission3.Action = 'Action4';
        userPermission3.Allow = true;
        defaultUser.ApplicationPermissions = [userPermission1, userPermission2, userPermission3];

        //Roles
        var role1 = new Models.SecurityRole();
        role1.RoleName = 'Role1';
        var role1Permission1 = new Models.Permission();
        role1Permission1.Action = 'Action1';
        role1Permission1.Allow = true;
        var role1Permission2 = new Models.Permission();
        role1Permission2.Action = 'Action2';
        role1Permission2.Allow = false;
        role1.ApplicationPermissions = [role1Permission1, role1Permission2];

        var role2 = new Models.SecurityRole();
        role2.RoleName = 'Role2';
        var role2Permission1 = new Models.Permission();
        role2Permission1.Action = 'Action1';
        role2Permission1.Allow = false;
        var role2Permission2 = new Models.Permission();
        role2Permission2.Action = 'Action3';
        role2Permission2.Allow = true;
        role2.ApplicationPermissions = [role2Permission1, role2Permission2];

        defaultUser.Roles = [role1, role2];

        return defaultSession;
    };

    //Global actions
    it('should allow user to do global action when he has explicit permission for it', function () {
        //Arrange
        //Act
        var allow = systemUnderTest.UserCanPerformGlobalAction('Action4');

        //Assert
        expect(allow).toEqual(true);
    });

    it('should not allow user to do global action when he has no permission or no role with give permission', function () {
        //Arrange
        //Act
        var allow = systemUnderTest.UserCanPerformGlobalAction('Action5');

        //Assert
        expect(allow).toEqual(false);
    });

    it('should check role permission when user permission is not present', function () {
        //Arrange
        //Act
        var allow = systemUnderTest.UserCanPerformGlobalAction('Action1');

        //Assert
        expect(allow).toEqual(true);
    });

    it('should not allow user to do global action when he has explicit permission that denies it even when his role allows him to', function () {
        //Arrange
        //Act
        var allow = systemUnderTest.UserCanPerformGlobalAction('Action3');

        //Assert
        expect(allow).toEqual(false);
    });

    it('should allow superuser to do any global action', function () {
        //Arrange
        var superSession:Models.UserSession = createDefaultSession();
        superSession.User.IsSuperUser = true;
        stateServiceMock.SetCurrentUserSession(superSession);

        //Act
        var allow = systemUnderTest.UserCanPerformGlobalAction('AnyAction');

        //Assert
        expect(allow).toEqual(true);
    });

    //Object actions
    it('should allow user to do object action when he is in permitted users', function () {
        //Arrange
        var permissionObject:Models.IPermissionObject = new Models.EntityMetadata();
        var action1permissions = new Models.CascadingPermission();
        action1permissions.Action = 'Action1';
        var action2permissions = new Models.CascadingPermission();
        action2permissions.Action = 'Action2';
        action2permissions.AllowUsers = ['TestUser', 'OtherUser'];
        action2permissions.DenyUsers = ['DenyUser'];
        permissionObject.Permissions = [action1permissions, action2permissions];

        //Act
        var allow = systemUnderTest.UserCanPerformObjectAction('Action2', permissionObject);

        //Assert
        expect(allow).toEqual(true);
    });

    it('should allow user to do object action when he has role that is in permitted roles', function () {
        //Arrange
        var permissionObject:Models.IPermissionObject = new Models.EntityMetadata();
        var action1permissions = new Models.CascadingPermission();
        action1permissions.Action = 'Action1';
        var action2permissions = new Models.CascadingPermission();
        action2permissions.Action = 'Action2';
        action2permissions.AllowUsers = ['OtherUser'];
        action2permissions.DenyUsers = ['DenyUser'];
        action2permissions.AllowRoles = ['SomeRole', 'OtherRole', 'Role1'];
        permissionObject.Permissions = [action1permissions, action2permissions];

        //Act
        var allow = systemUnderTest.UserCanPerformObjectAction('Action2', permissionObject);

        //Assert
        expect(allow).toEqual(true);
    });

    it('should not allow user to do object action when he is in denied user even when he is member of one of allowed roles', function () {
        //Arrange
        var permissionObject:Models.IPermissionObject = new Models.EntityMetadata();
        var action1permissions = new Models.CascadingPermission();
        action1permissions.Action = 'Action1';
        var action2permissions = new Models.CascadingPermission();
        action2permissions.Action = 'Action2';
        action2permissions.AllowUsers = ['OtherUser'];
        action2permissions.DenyUsers = ['TestUser'];
        action2permissions.AllowRoles = ['SomeRole', 'OtherRole', 'Role1'];
        permissionObject.Permissions = [action1permissions, action2permissions];

        //Act
        var allow = systemUnderTest.UserCanPerformObjectAction('Action2', permissionObject);

        //Assert
        expect(allow).toEqual(false);
    });

    it('should return default action rule when user and role rules do not return any results', function () {
        //Arrange
        var permissionObject:Models.IPermissionObject = new Models.EntityMetadata();
        var action1permissions = new Models.CascadingPermission();
        action1permissions.Action = 'Action1';
        action1permissions.Allow = true;
        var action2permissions = new Models.CascadingPermission();
        action2permissions.Action = 'Action2';
        action2permissions.Allow = false;
        permissionObject.Permissions = [action1permissions, action2permissions];

        //Act
        var allow1 = systemUnderTest.UserCanPerformObjectAction('Action1', permissionObject);
        var allow2 = systemUnderTest.UserCanPerformObjectAction('Action2', permissionObject);

        //Assert
        expect(allow1).toEqual(true);
        expect(allow2).toEqual(false);
    });

    it('should allow superuser to do any object action', function () {
        //Arrange
        var superSession:Models.UserSession = createDefaultSession();
        superSession.User.IsSuperUser = true;
        stateServiceMock.SetCurrentUserSession(superSession);

        var permissionObject:Models.IPermissionObject = new Models.EntityMetadata();
        permissionObject.Permissions = [];

        //Act
        var allow = systemUnderTest.UserCanPerformObjectAction('AnyAction', permissionObject);

        //Assert
        expect(allow).toEqual(true);
    });
});