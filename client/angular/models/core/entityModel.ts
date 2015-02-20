/// <reference path="entityMetadataModel.ts" />
/// <reference path="persistentObject.ts" />
/// <reference path="../../../extensions/arrayExtensions.ts" />
/// <reference path="../../../extensions/dateExtensions.ts" />

'use strict';
var _global:any = this;

//Model representing entity record
module Models {
    export class Entity extends PersistentObject {
        constructor(entitySystemName:string) {
            super();
            this.EntitySystemName = entitySystemName;
            this.Data = {};
            this.ErrorFields = [];
        }

        //Common metadata
        public EntitySystemName:string;

        //Specific entity data (schema depends on underlying metadata)
        public Data:any;

        //Validation
        public ErrorFields:string[];

        public ValidateAllFields(entityMetadata:Models.EntityMetadata):void {
            this.ErrorFields = [];
            var fieldsLength:number = (entityMetadata.Fields && entityMetadata.Fields.length) || 0;
            for (var i = 0; i < fieldsLength; i++) {
                var fieldMetadata = entityMetadata.Fields[i];
                var value:any = this.Data[fieldMetadata.FieldSystemName];
                var fieldValid:boolean = fieldMetadata.ValidateValue(value);
                if (!fieldValid) this.ErrorFields.add(fieldMetadata.FieldSystemName);
            }
        }

        //Display name of record
        public GetDisplayName(entityMetadata:Models.EntityMetadata):string {
            var displayItems = [];
            for (var i = 0; i < entityMetadata.Fields.length; i++) {
                var fieldMetadata = entityMetadata.Fields[i];
                if (fieldMetadata.DisplayInListName) {
                    var fieldTypeComponent = _global.Instances.FieldTypesRegistry.GetFieldType(fieldMetadata.FieldTypeName, true);
                    var value = this.Data[fieldMetadata.FieldSystemName];
                    var displayValue = fieldTypeComponent.FormatValue(value);
                    if (displayValue) displayItems.push(displayValue);
                }
            }
            return displayItems.join(' - ');
        }
    }
}
