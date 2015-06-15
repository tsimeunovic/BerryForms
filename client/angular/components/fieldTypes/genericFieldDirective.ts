/// <reference path="baseFieldDirective.ts" />

module Directives {
    'use strict';

    export class GenericField extends Directives.BaseField {
        public static injectionFor(fieldName:string):any[] {
            return [
                GenericField.DirectiveOptionsFor(fieldName)
            ];
        }

        public static DirectiveOptionsFor(fieldName:string):any {
            return function ():void {
                return BaseField.DirectiveOptions(fieldName, GenericField.StaticConstructor);
            };
        }

        public static StaticConstructor():Directives.GenericField {
            return new Directives.GenericField();
        }
    }
}
