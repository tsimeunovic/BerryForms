/// <reference path="../../../directives/fieldDirectiveBase.ts" />

module Directives {
    'use strict';

    export class RelationField extends Directives.BaseField {
        /* tslint:disable:member-ordering */
        public static injection():any[] {
            return [
                RelationField.DirectiveOptions
            ];
        }

        public static DirectiveOptions():any {
            return BaseField.DirectiveOptions('Relation', RelationField.StaticConstructor);
        }

        public static StaticConstructor():Directives.RelationField {
            return new Directives.RelationField();
        }
    }
}
