'use strict';

//Base class for any model that can be persisted in database
module Models {
    export class PersistentObject {
        constructor() {
        }

        //Identifier (set on server)
        public Id:number;

        //Created and modified info (set on server)
        public CreatedDate:number;
        public CreatedBy:string;
        public ModifiedDate:number;
        public ModifiedBy:string;
    }
}
