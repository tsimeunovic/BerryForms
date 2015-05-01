/// <reference path="../../../directives/fieldDirectiveBase.ts" />

module Directives {
    'use strict';

    export class TextField extends Directives.BaseField {
        public static injection():any[] {
            return [
                TextField.DirectiveOptions
            ];
        }

        public static DirectiveOptions():any {
            return BaseField.DirectiveOptions('Text', TextField.StaticConstructor);
        }

        public static StaticConstructor():Directives.TextField {
            return new Directives.TextField();
        }
    }
}
