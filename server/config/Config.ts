/// <reference path="../GlobalReferences.ts" />

export module Config {
    'use strict';

    export class Server {
        //General
        public static SystemPrefix:string = '__';

        //Node server
        public static NodePort:number = 8080;
        public static ApiPrefix:string = 'api';

        //Mongo Db
        public static MongoServerUri:string = 'localhost';
        public static MongoServerPort:number = 27017;
        public static BerryFormsDatabaseName:string = 'BerryForms';
        public static UseOptimisticConcurrencyUpdate:boolean = true;

        //Security
        public static TokenValidityMinutes:number = 15;
        public static KeepMeLoggedInTokenValidityMinutes:number = 15 * 24 * 60; //15 days
        public static PasswordSalt:string = 'I^F^y_UmK~G^=1i+xPi|t1_lSOiq~+~La=CvE1Yeh4V~izp~4AnEDVixy4R|';
            //Changing will break entire password database
        public static TokenSalt:string = 'RO^zMe1jFN%9L9BgNlP~LJqOvN15ZCAv9lct-+uIgDZWsnaNks0%ZKw3guul';
            //Changing will invalidate all currently valid tokens
        public static SuperUserName:string = 'admin';
        public static SuperUserPassword:string = 'admin';

        //Miscelanous
        public static LogRetrieveCount:number = 8;
        public static LogSummaryMinutes:number = 7 * 24 * 60; //7 days
        public static FieldSummarySample:number = 512;
    }
}
