/// <reference path="../boolean/booleanFieldMetadataModel.ts" />
/// <reference path="../date/dateFieldMetadataModel.ts" />
/// <reference path="../list/listFieldMetadataModel.ts" />
/// <reference path="../select/selectFieldMetadataModel.ts" />
/// <reference path="../textarea/textareaFieldMetadataModel.ts" />
/// <reference path="../text/textFieldMetadataModel.ts" />
/// <reference path="../number/numberFieldMetadataModel.ts" />
/// <reference path="./../../../data/createFieldFormFields.ts" />
/// <reference path="../../../models/core/entityMetadataModel.ts" />
/// <reference path="../../../interfaces/localization/IResources.ts" />
/// <reference path="../../../services/localization/localizationService.ts" />
/// <reference path="../../../../config/config.ts" />

module Data {
    'use strict';

    export class CreateTextareaFieldFormFields {
        public static GetData():Models.EntityMetadata {
            var textareaFields:Models.EntityMetadata = Data.CreateFieldFormFields.GetData(null);
            textareaFields.Fields = textareaFields.Fields.concat([
                CreateTextareaFieldFormFields.MaxLengthField()
            ]);
            return textareaFields;
        }

        private static MaxLengthField():Models.NumberFieldMetadata {
            var result:Models.NumberFieldMetadata = new Models.NumberFieldMetadata();
            result.FieldSystemName = 'MaxLength';
            result.FieldName = Services.LocalizationService.Resources.MaxLength;
            result.FieldDescription = result.FieldName;
            result.AllowFloating = false;
            result.MinValue = 1;
            result.MaxValue = 4096;
            return result;
        }
    }
}
