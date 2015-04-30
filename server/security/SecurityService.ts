/// <reference path="../GlobalReferences.ts" />
/// <reference path="../security/ISecurityService.ts" />

import NodeRepositoryContract = require('../data/entity/IEntityRepository');
import Contract = require('../security/ISecurityService');
import ErrorsModel = require('../model/ClientErrorsModel');
import ConfigServer = require('../config/Config');
var SHA256:any = require('crypto-js/sha256');

export module Security {
    'use strict';

    export class SecurityService implements Contract.Services.ISecurityService {
        constructor(nodeRepository:NodeRepositoryContract.Data.IEntityRepository<any>) {
            this.ServerConfig = ConfigServer.Config.Server;
        }

        private ServerConfig:any;

        public LoginUser(request:any, callback:(data:any, errors:ErrorsModel.Model.ClientErrorsModel)=>void):void {
            var data:any = request.body;
            var reqUserName:string = data && data.userName;
            var reqPassword:string = data && data.password;
            var validUser:boolean = reqUserName === this.ServerConfig.SuperUserName &&
                reqPassword === this.ServerConfig.SuperUserPassword;

            if (validUser) {
                var tokeValidityMinutes:number = ConfigServer.Config.Server.TokenValidityMinutes;
                var nowTime:number = (new Date()).getTime();
                var validTo:number = nowTime + tokeValidityMinutes * 60000;
                var token:string = this.GetTokenFor(reqUserName, validTo);

                //TODO: Retrieve user information (join database and super user from config)
                var session:any = {
                    User: {
                        UserName: reqUserName,
                        IsSuperUser: true
                    },
                    ValidTo: validTo,
                    Token: token
                };

                console.log('User \'' + reqUserName + '\' logged in');
                callback(session, null);
            } else {
                console.log('Unsuccessful login of \'' + reqUserName + '\'');
                var returnedError:ErrorsModel.Model.ClientErrorsModel =
                    ErrorsModel.Model.ClientErrorsModel.CreateWithError('InvalidUserNameOrPassword', null);
                callback(null, returnedError);
            }
        }

        public ValidateRequest(request:any, callback:(valid:boolean, errors:ErrorsModel.Model.ClientErrorsModel)=>void) {
            var userName:string = request.header('X-BF-Auth-User');
            var validToStr:string = request.header('X-BF-Auth-Valid-To');
            var validTo:number = parseInt(validToStr, 10);
            var token:string = request.header('X-BF-Auth-Token');

            //Validate date
            var nowTime:number = (new Date()).getTime();
            if (isNaN(validTo) || validTo < nowTime) {
                console.log('Session for \'' + userName + '\' expired');
                callback(false, null);
                return;
            }

            //Validate token
            var validToken:string = this.GetTokenFor(userName, validTo);
            if (validToken !== token) {
                console.log('Invalid token. User: \'' + userName + '\'. ValidTo: \'' + validTo + '\'. Token: \'' + token + '\'');
                callback(false, null);
                return;
            }

            //TODO: Retrieve user information (join database and super user from config)
            var session:any = {
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
        }

        private GetTokenFor(userName:string, validTo:number) {
            var tokenString:string = userName + validTo.toString() + this.ServerConfig.TokenSalt;
            return SHA256(tokenString).toString();
        }
    }
}
