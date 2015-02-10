/// <reference path="./IFieldType.ts" />

'use strict';

//Service for retrieving all registered field components in the system
module Components.FieldTypes {
    export interface IFieldTypesRegistry {
        GetFieldType(fieldTypeName:string, useDefaultForNonExisting:boolean):IFieldType;
    }
}
