/// <reference path="./listFieldMetadataModel.ts" />
/// <reference path="../baseFieldController.ts" />
/// <reference path="../../../models/core/entityModel.ts" />

module Components.FieldTypes {
    'use strict';

    export class ListFieldController extends BaseFieldController<Models.ListFieldMetadata> {
        /* tslint:disable:member-ordering */
        public static injection():any[] {
            return [
                '$scope',
                ListFieldController
            ];
        }

        constructor(Scope:any) {
            super(Scope);
        }

        private CurrentValue:string;

        /* tslint:disable:no-unused-variable */
        private Add($event:any):void {
            $event.preventDefault();
            $event.stopPropagation();

            //Initialize entity object if value is missing
            var fieldSystemName:string = this.FieldMetadata.FieldSystemName;
            this.Entity.Data[fieldSystemName] = this.Entity.Data[fieldSystemName] || [];

            var existingValues:any = this.Entity.Data[this.FieldMetadata.FieldSystemName];
            var currentValue:string = this.CurrentValue;
            if (currentValue) {
                existingValues.add(currentValue);
                this.Scope.ValueChanged();
                this.CurrentValue = null;
            }
        }

        /* tslint:disable:no-unused-variable */
        private Remove($event:any, value:string):void {
            $event.preventDefault();
            $event.stopPropagation();

            var existingValues:any = this.Entity.Data[this.FieldMetadata.FieldSystemName];
            existingValues.remove(value);
            this.Scope.ValueChanged();
            this.CurrentValue = null;
        }
    }
}
