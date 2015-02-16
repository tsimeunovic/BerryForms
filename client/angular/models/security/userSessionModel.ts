/// <reference path="../security/userModel.ts" />

'use strict';

//Represents logged in user session
module Models {
    export class UserSession {
        public User:Models.User;
        public ValidTo:number;
        public Token:string;
    }
}
