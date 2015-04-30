//Represents error propagated to the client
export module Model {
    'use strict';

    export class ClientErrorModel {
        public ErrorTypeKey:string;
        public ErrorParameters:string[];

        constructor(key:string, parameters:string[]) {
            this.ErrorTypeKey = key;
            this.ErrorParameters = parameters;
        }
    }
}
