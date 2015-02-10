'use strict';

export module Model {
    export class ClientErrorModel {
        public ErrorTypeKey:string;
        public ErrorParameters:string[];

        constructor(key:string, parameters:string[]) {
            this.ErrorTypeKey = key;
            this.ErrorParameters = parameters;
        }
    }
}