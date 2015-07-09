/// <reference path="./numberFieldMetadataModel.ts" />
/// <reference path="../baseFieldController.ts" />
/// <reference path="../../../models/core/entityModel.ts" />

module Components.FieldTypes {
    'use strict';

    export class NumberFieldController extends BaseFieldController<Models.NumberFieldMetadata> {
        //@ngInject
        constructor($scope:any) {
            super($scope);
            this.EntityValueChangedEvent = this.EntityValueChanged.bind(this);
            this.EntityValueChanged();
        }

        public Value:string;

        public UIValueChanged():void {
            var uiValueStr:string = this.Value;
            var parsed:number = parseFloat(this.Value);
            this.SetBoundFieldValue(parsed || uiValueStr || null);
        }

        private EntityValueChanged():void {
            var parsed:number = parseFloat(this.Value);
            var currentValue:number = this.GetBoundFieldValue();
            if (parsed !== currentValue) {
                this.Value = currentValue && currentValue.toString();
            }
        }
    }
}
