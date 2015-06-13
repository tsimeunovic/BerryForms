/// <reference path="./textFieldMetadataModel.ts" />
/// <reference path="../baseFieldController.ts" />

module Components.FieldTypes {
    'use strict';

    export class TextFieldController extends BaseFieldController<Models.TextFieldMetadata> {
        /* tslint:disable:member-ordering */
        public static injection():any[] {
            return [
                '$scope',
                TextFieldController
            ];
        }

        constructor(Scope:any) {
            super(Scope);
        }
    }
}
