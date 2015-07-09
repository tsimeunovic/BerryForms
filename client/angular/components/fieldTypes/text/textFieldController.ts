/// <reference path="./textFieldMetadataModel.ts" />
/// <reference path="../baseFieldController.ts" />

module Components.FieldTypes {
    'use strict';

    export class TextFieldController extends BaseFieldController<Models.TextFieldMetadata> {
        //@ngInject
        constructor($scope:any) {
            super($scope);
        }
    }
}
