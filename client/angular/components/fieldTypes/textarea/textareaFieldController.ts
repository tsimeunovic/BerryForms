/// <reference path="./textareaFieldMetadataModel.ts" />
/// <reference path="../baseFieldController.ts" />

module Components.FieldTypes {
    'use strict';

    export class TextareaFieldController extends BaseFieldController<Models.TextareaFieldMetadata> {
        //@ngInject
        constructor($scope:any) {
            super($scope);
        }
    }
}
