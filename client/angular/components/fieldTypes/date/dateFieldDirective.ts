/// <reference path="../../../directives/fieldDirectiveBase.ts" />
/// <reference path="../../../../config/config.ts" />

module Directives {
    'use strict';

    export class DateField extends Directives.BaseField {
        /* tslint:disable:member-ordering */
        public static injection():any[] {
            return [
                DateField.DirectiveOptions
            ];
        }

        public static DirectiveOptions():any {
            return BaseField.DirectiveOptions('Date', DateField.StaticConstructor);
        }

        public static StaticConstructor():Directives.DateField {
            return new Directives.DateField();
        }
    }
}
