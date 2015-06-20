/// <reference path="../../models/core/fieldMetadataModel.ts" />
/// <reference path="../../../static/routeParams.ts" />

module Components.FieldTypes {
    'use strict';

    export class BaseFieldController<T extends Models.FieldMetadata> {
        constructor(public Scope:any) {
            this.Entity = Scope.Entity;
            this.FieldMetadata = Scope.field;
            this.Resources = Services.LocalizationService.Resources;
            this.IsValid = false;

            this.WatchValue();
            this.ValueChanged();
        }

        //Bound data
        public Entity:Models.Entity;
        public FieldMetadata:T;
        public IsValid:boolean;

        //Localization resources
        public Resources:Localization.IResources;

        //Entity value changed handler (to register another handler on existing watch)
        protected EntityValueChangedEvent:() => void;

        public GetBoundFieldValue():any {
            return this.Entity.Data[this.FieldMetadata.FieldSystemName];
        }

        public SetBoundFieldValue(value:any):void {
            this.Entity.Data[this.FieldMetadata.FieldSystemName] = value;
        }

        public WatchValue():void {
            var _this:BaseFieldController<Models.FieldMetadata> = this;
            var watchValueFn:() => void = function ():void {
                _this.ValueChanged();
                if (_this.EntityValueChangedEvent) {
                    _this.EntityValueChangedEvent();
                }
            };

            //Watch bound value
            this.Scope.$watch('Entity.Data[field.FieldSystemName]', watchValueFn);

            //Watch parent scope entity
            this.Scope.$watch('Entity', function ():void {
                _this.Entity = _this.Scope.Entity;
                watchValueFn();
            });
        }

        public ValueChanged():void {
            if (!this.Entity) {
                this.IsValid = false;
                return;
            }

            var fieldMetadata:Models.FieldMetadata = this.FieldMetadata;
            var value:any = this.Entity.Data[fieldMetadata.FieldSystemName];
            var valid:boolean = fieldMetadata.ValidateValue(value);

            if (valid) {
                this.Entity.ErrorFields.remove(fieldMetadata.FieldSystemName);
            } else {
                this.Entity.ErrorFields.add(fieldMetadata.FieldSystemName);
            }

            this.IsValid = valid;
            if (fieldMetadata.ValueChanged) {
                fieldMetadata.ValueChanged(value, valid);
            }
        }

        protected StopEventPropagation($event:any):void {
            if ($event) {
                $event.preventDefault();
                $event.stopPropagation();
            }
        }

        protected ApplyChanges():void {
            this.Scope.$apply(function ():void {
                //Nothing to apply, just run digest to detect opened dropdown
            });
        }
    }
}
