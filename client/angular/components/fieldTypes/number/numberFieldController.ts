/// <reference path="./numberFieldMetadataModel.ts" />
/// <reference path="../baseFieldController.ts" />
/// <reference path="../../../models/core/entityModel.ts" />

module Components.FieldTypes {
    'use strict';

    export class NumberFieldController extends BaseFieldController<Models.NumberFieldMetadata> {
        /* tslint:disable:member-ordering */
        public static injection():any[] {
            return [
                '$scope',
                NumberFieldController
            ];
        }

        constructor(Scope:any) {
            super(Scope);

            this.EntityValueChanged();
            this.Watch();
        }

        private Value:string;

        private Watch():void {
            var _this:NumberFieldController = this;

            //Underlying model changed
            this.Scope.$watch('Entity.Data[field.FieldSystemName]', function ():void {
                _this.EntityValueChanged();
            });

            //User changed value
            this.Scope.$watch(
                function ():any {
                    return _this.Value;
                }, function ():void {
                    _this.UIValueChanged();
                });
        }

        private EntityValueChanged():void {
            var parsed:number = parseFloat(this.Value);
            var currentValue:number = this.Entity.Data[this.FieldMetadata.FieldSystemName];
            if (parsed !== currentValue) {
                this.Value = currentValue && currentValue.toString();
            }
        }

        private UIValueChanged():void {
            var uiValueStr:string = this.Value;
            var parsed:number = parseFloat(uiValueStr);
            this.Entity.Data[this.FieldMetadata.FieldSystemName] = parsed || uiValueStr || null;
        }
    }
}
