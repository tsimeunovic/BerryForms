/// <reference path="../../../directives/fieldDirectiveBase.ts" />

module Directives {
    'use strict';

    export class NumberField extends Directives.BaseField {
        public static injection():any[] {
            return [
                NumberField.DirectiveOptions
            ];
        }

        public static DirectiveOptions():any {
            return BaseField.DirectiveOptions('Number', NumberField.StaticConstructor);
        }

        public static StaticConstructor():Directives.NumberField {
            return new Directives.NumberField();
        }

        public Link($scope:any, $linkElement:any, $linkAttributes:any):void {
            super.Link($scope, $linkElement, $linkAttributes);

            this.EntityValueChanged();
            this.Watch();
        }

        private Watch():void {
            var _this:NumberField = this;

            //Underlying model changed
            this.Scope.$watch('Entity.Data[field.FieldSystemName]', function ():void {
                _this.EntityValueChanged();
            });

            //User changed value
            this.Scope.$watch('Value', function ():void {
                _this.UIValueChanged();
            });
        }

        private EntityValueChanged():void {
            var uiValueStr:string = this.Scope.Value;
            var parsed:number = parseFloat(uiValueStr);
            if (parsed !== this.Scope.Entity.Data[this.Scope.field.FieldSystemName]) {
                this.Scope.Value = this.Scope.Entity.Data[this.Scope.field.FieldSystemName];
            }
        }

        private UIValueChanged():void {
            var uiValueStr:string = this.Scope.Value;
            var parsed:number = parseFloat(uiValueStr);
            this.Scope.Entity.Data[this.Scope.field.FieldSystemName] = parsed || uiValueStr || null;
        }
    }
}
