/// <reference path="../GlobalReferences.ts" />

'use strict';

export module Config {
    export class Server {
        //General
        public static SystemPrefix = '__';

        //Node server
        public static NodePort:number = 8080;
        public static ApiPrefix:string = 'api';

        //Mongo Db
        public static MongoServerUri:string = "localhost";
        public static MongoServerPort:number = 27017;
        public static BerryFormsDatabaseName:string = "BerryForms";

        public static UseOptimisticConcurrencyUpdate:boolean = true;

        //Security
        public static TokenValidityMinutes:number = 15;
        public static PasswordSalt:string = 'I^F^y_UmK~G^=1i+xPi|t1_lSOiq~+~La=CvE1Yeh4V~izp~4AnEDVixy4R|';
        public static TokenSalt:string = 'RO^zMe1jFN%9L9BgNlP~LJqOvN15ZCAv9lct-+uIgDZWsnaNks0%ZKw3guul';

        //Temporary: Authentication (will be later stored in DB for multiple users)
        public static UserName:string = 'admin';
        public static Password:string = 'admin';
    }
}
