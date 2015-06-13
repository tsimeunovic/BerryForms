/// <reference path="../../../directives/fieldDirectiveBase.ts" />
/// <reference path="../../../../config/config.ts" />

module Directives {
    'use strict';

    export class SelectField extends Directives.BaseField {
        /* tslint:disable:member-ordering */
        public static injection():any[] {
            return [
                SelectField.DirectiveOptions
            ];
        }

        public static DirectiveOptions():any {
            return BaseField.DirectiveOptions('Select', SelectField.StaticConstructor);
        }

        public static StaticConstructor():Directives.SelectField {
            return new Directives.SelectField();
        }
    }
}
