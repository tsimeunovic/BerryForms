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

        public static DirectiveOptions():any {
            return BaseField.DirectiveOptions('List', ListField.StaticConstructor);
        }

        public static StaticConstructor():Directives.ListField {
            return new Directives.ListField();
        }
    }
}
