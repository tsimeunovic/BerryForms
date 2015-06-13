/// <reference path="./booleanFieldMetadataModel.ts" />
/// <reference path="../baseFieldController.ts" />

module Components.FieldTypes {
    'use strict';

    export class BooleanFieldController extends BaseFieldController<Models.BooleanFieldMetadata> {
        /* tslint:disable:member-ordering */
        public static injection():any[] {
            return [
                '$scope',
                BooleanFieldController
            ];
        }

        constructor(Scope:any) {
            super(Scope);
        }
    }
}
