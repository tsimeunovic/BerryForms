/// <reference path="../../../directives/fieldDirectiveBase.ts" />

'use strict';

module Directives {
    export class TextField extends Directives.BaseField {
        public static injection():any[] {
            return [
                TextField.DirectiveOptions
            ];
        }

        public static DirectiveOptions():any
        {
            return BaseField.DirectiveOptions("Text", TextField.StaticConstructor);
        }

        public static StaticConstructor():Directives.TextField
        {
            return new Directives.TextField();
        }
    }
}