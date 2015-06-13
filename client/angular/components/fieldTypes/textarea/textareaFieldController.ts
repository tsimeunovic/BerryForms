/// <reference path="./textareaFieldMetadataModel.ts" />
/// <reference path="../baseFieldController.ts" />

module Components.FieldTypes {
    'use strict';

    export class TextareaFieldController extends BaseFieldController<Models.TextareaFieldMetadata> {
        /* tslint:disable:member-ordering */
        public static injection():any[] {
            return [
                '$scope',
                TextareaFieldController
            ];
        }

        constructor(Scope:any) {
            super(Scope);
        }
    }
}
