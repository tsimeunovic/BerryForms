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
    }
}
