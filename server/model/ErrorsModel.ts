'use strict';

export module Model {
    export class ErrorsModel<T> {
        public Type:string;
        public Errors:T[];

        constructor() {
            this.Errors = [];
        }

        public HasErrors():boolean{
            return this.Errors && this.Errors.length > 0;
        }
    }
}
