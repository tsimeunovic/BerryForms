//Base class for any model that can be persisted in database
module Models {
    'use strict';

    export class PersistentObject {
        //Identifier (set on server)
        public Id:number;

        //Created and modified info (set on server)
        public CreatedDate:number;
        public CreatedBy:string;
        public ModifiedDate:number;
        public ModifiedBy:string;
    }
}
