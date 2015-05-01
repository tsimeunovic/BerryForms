/// <reference path="../../../directives/fieldDirectiveBase.ts" />

module Directives {
    'use strict';

    export class ListField extends Directives.BaseField {
        /* tslint:disable:member-ordering */
        public static injection():any[] {
            return [
                ListField.DirectiveOptions
            ];
        }

        private CurrentValue:string;

        public static DirectiveOptions():any {
            return BaseField.DirectiveOptions('List', ListField.StaticConstructor);
        }

        public static StaticConstructor():Directives.ListField {
            return new Directives.ListField();
        }

        public Link($scope:any, $linkElement:any, $linkAttributes:any):void {
            super.Link($scope, $linkElement, $linkAttributes);

            this.Scope.CurrentValue = this.CurrentValue;
            this.Scope.Add = this.Add.bind(this);
            this.Scope.Remove = this.Remove.bind(this);
        }

        private Add($event:any):void {
            $event.preventDefault();
            $event.stopPropagation();

            //Initialize entity object if value is missing
            var fieldSystemName:string = this.Scope.field.FieldSystemName;
            this.Scope.Entity.Data[fieldSystemName] = this.Scope.Entity.Data[fieldSystemName] || [];

            var existingValues:any = this.Scope.Entity.Data[this.Scope.field.FieldSystemName];
            var currentValue:string = this.Scope.CurrentValue;
            if (currentValue) {
                existingValues.add(currentValue);
                this.ValueChanged();
                this.Scope.CurrentValue = null;
            }
        }

        private Remove($event:any, value:string):void {
            $event.preventDefault();
            $event.stopPropagation();

            var existingValues:any = this.Scope.Entity.Data[this.Scope.field.FieldSystemName];
            existingValues.remove(value);
            this.ValueChanged();
            this.Scope.CurrentValue = null;
        }
    }
}
