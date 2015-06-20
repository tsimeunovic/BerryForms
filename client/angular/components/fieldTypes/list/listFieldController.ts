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

        public CurrentValue:string;

        public Add($event:any):void {
            this.StopEventPropagation($event);

            //Initialize entity object if value is missing
            this.SetBoundFieldValue(this.GetBoundFieldValue() || []);

            var existingValues:any = this.GetBoundFieldValue();
            var currentValue:string = this.CurrentValue;
            if (currentValue) {
                existingValues.add(currentValue);
                this.ValueChanged();
                this.CurrentValue = null;
            }
        }

        public Remove($event:any, value:string):void {
            this.StopEventPropagation($event);
            var existingValues:any = this.GetBoundFieldValue();
            existingValues.remove(value);
            this.ValueChanged();
        }
    }
}
