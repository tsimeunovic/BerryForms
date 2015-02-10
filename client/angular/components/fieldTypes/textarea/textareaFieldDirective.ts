/// <reference path="../../../directives/fieldDirectiveBase.ts" />

'use strict';

module Directives {
    export class TextareaField extends Directives.BaseField {
        public static injection():any[] {
            return [
                TextareaField.DirectiveOptions
            ];
        }

        public static DirectiveOptions():any
        {
            return BaseField.DirectiveOptions("Textarea", TextareaField.StaticConstructor);
        }

        public static StaticConstructor():Directives.TextareaField
        {
            return new Directives.TextareaField();
        }
    }
}