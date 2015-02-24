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

'use strict';

module Data {
    export class CreateTextFieldFormFields {
        public static GetData():Models.EntityMetadata {
            var textFields = Data.CreateFieldFormFields.GetData(null);
            textFields.Fields = textFields.Fields.concat([
                CreateTextFieldFormFields.RegularExpressionField(),
                CreateTextFieldFormFields.MaxLengthField()
            ]);
            return textFields;
        }

        private static RegularExpressionField():Models.TextFieldMetadata {
            var result = new Models.TextFieldMetadata();
            result.FieldSystemName = 'RegularExpression';
            result.FieldName = Services.LocalizationService.Resources.RegularExpression;
            result.FieldDescription = result.FieldName;
            return result;
        }

        private static MaxLengthField():Models.NumberFieldMetadata {
            var result = new Models.NumberFieldMetadata();
            result.FieldSystemName = 'MaxLength';
            result.FieldName = Services.LocalizationService.Resources.MaxLength;
            result.FieldDescription = result.FieldName;
            result.AllowFloating = false;
            result.MinValue = 1;
            result.MaxValue = 1024;
            return result;
        }
    }
}
