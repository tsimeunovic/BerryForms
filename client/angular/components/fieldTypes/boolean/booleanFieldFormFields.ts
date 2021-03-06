/// <reference path="./booleanFieldMetadataModel.ts" />
/// <reference path="./../../../data/createFieldFormFields.ts" />
/// <reference path="../../../models/core/entityMetadataModel.ts" />
/// <reference path="../date/dateFieldMetadataModel.ts" />
/// <reference path="../list/listFieldMetadataModel.ts" />
/// <reference path="../select/selectFieldMetadataModel.ts" />
/// <reference path="../textarea/textareaFieldMetadataModel.ts" />
/// <reference path="../text/textFieldMetadataModel.ts" />
/// <reference path="../../../interfaces/localization/IResources.ts" />
/// <reference path="../../../services/localization/localizationService.ts" />
/// <reference path="../../../../config/config.ts" />

module Data {
    'use strict';

    export class CreateBooleanFieldFormFields {
        public static GetData():Models.EntityMetadata {
            var booleanFields:Models.EntityMetadata = Data.CreateFieldFormFields.GetData(null);
            booleanFields.Fields = booleanFields.Fields.concat([
                CreateBooleanFieldFormFields.ThreeStateField()
            ]);
            return booleanFields;
        }

        private static ThreeStateField():Models.BooleanFieldMetadata {
            var result:Models.BooleanFieldMetadata = new Models.BooleanFieldMetadata();
            result.FieldSystemName = 'ThreeState';
            result.FieldName = Services.LocalizationService.Resources.ThreeState;
            result.FieldDescription = result.FieldName;
            result.Required = true;
            return result;
        }
    }
}
