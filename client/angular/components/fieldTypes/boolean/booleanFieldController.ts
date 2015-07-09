/// <reference path="./booleanFieldMetadataModel.ts" />
/// <reference path="../baseFieldController.ts" />

module Components.FieldTypes {
    'use strict';

    export class BooleanFieldController extends BaseFieldController<Models.BooleanFieldMetadata> {
        //@ngInject
        constructor($scope:any) {
            super($scope);
        }
    }
}
