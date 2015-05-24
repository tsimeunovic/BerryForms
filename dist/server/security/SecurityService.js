/// <reference path="../GlobalReferences.ts" />
/// <reference path="../security/ISecurityService.ts" />
var ErrorsModel = require('../model/ClientErrorsModel');
var ConfigServer = require('../config/Config');
var SHA256 = require('crypto-js/sha256');
var Security;
(function (Security) {
    'use strict';
    var SecurityService = (function () {
        function SecurityService(nodeRepository) {
            this.ServerConfig = ConfigServer.Config.Server;
        }
        SecurityService.prototype.LoginUser = function (request, callback) {
            var data = request.body;
            var reqUserName = data && data.userName;
            var reqPassword = data && data.password;
            var validUser = reqUserName === this.ServerConfig.SuperUserName &&
                reqPassword === this.ServerConfig.SuperUserPassword;
            if (validUser) {
                var tokeValidityMinutes = ConfigServer.Config.Server.TokenValidityMinutes;
                var nowTime = (new Date()).getTime();
                var validTo = nowTime + tokeValidityMinutes * 60000;
                var token = this.GetTokenFor(reqUserName, validTo);
                //TODO: Retrieve user information (join database and super user from config)
                var session = {
                    User: {
                        UserName: reqUserName,
                        IsSuperUser: true
                    },
                    ValidTo: validTo,
                    Token: token
                };
                console.log('User \'' + reqUserName + '\' logged in');
                callback(session, null);
            }
            else {
                console.log('Unsuccessful login of \'' + reqUserName + '\'');
                var returnedError = ErrorsModel.Model.ClientErrorsModel.CreateWithError('InvalidUserNameOrPassword', null);
                callback(null, returnedError);
            }
        };
        SecurityService.prototype.ValidateRequest = function (request, callback) {
            var userName = request.header('X-BF-Auth-User');
            var validToStr = request.header('X-BF-Auth-Valid-To');
            var validTo = parseInt(validToStr, 10);
            var token = request.header('X-BF-Auth-Token');
            //Validate date
            var nowTime = (new Date()).getTime();
            if (isNaN(validTo) || validTo < nowTime) {
                console.log('Session for \'' + userName + '\' expired');
                callback(false, null);
                return;
            }
            //Validate token
            var validToken = this.GetTokenFor(userName, validTo);
            if (validToken !== token) {
                console.log('Invalid token. User: \'' + userName + '\'. ValidTo: \'' + validTo + '\'. Token: \'' + token + '\'');
                callback(false, null);
                return;
            }
            //TODO: Retrieve user information (join database and super user from config)
            var session = {
                User: {
                    UserName: userName,
                    IsSuperUser: true
                },
                ValidTo: validTo,
                Token: token
            };
            //Extend request
            request.session = session;
            callback(true, null);
        };
        SecurityService.prototype.GetTokenFor = function (userName, validTo) {
            var tokenString = userName + validTo.toString() + this.ServerConfig.TokenSalt;
            return SHA256(tokenString).toString();
        };
        return SecurityService;
    })();
    Security.SecurityService = SecurityService;
})(Security = exports.Security || (exports.Security = {}));
//# sourceMappingURL=SecurityService.js.map