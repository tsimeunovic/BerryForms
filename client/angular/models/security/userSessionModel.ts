/// <reference path="../security/userModel.ts" />

//Represents logged in user session
module Models {
    'use strict';

    export class UserSession {
        public User:Models.User;
        public ValidTo:number;
        public Token:string;
    }
}
