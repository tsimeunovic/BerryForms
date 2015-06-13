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
    }
}
