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

        public Entity:Models.Entity;
        public FieldMetadata:T;
        public IsValid:boolean;
        public Resources:Localization.IResources;

        public WatchValue():void {
            var _this:BaseFieldController<Models.FieldMetadata> = this;

            this.Scope.$watch('Entity.Data[field.FieldSystemName]', function ():void {
                _this.ValueChanged();
            });

            //Watch parent scope entity
            this.Scope.$watch('Entity', function ():void {
                _this.Entity = _this.Scope.Entity;
                _this.ValueChanged();
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
    }
}
