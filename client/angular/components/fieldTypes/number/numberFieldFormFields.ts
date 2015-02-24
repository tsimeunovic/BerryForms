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
    export class CreateNumberFieldFormFields {
        public static GetData():Models.EntityMetadata {
            var numberFields = Data.CreateFieldFormFields.GetData(null);
            numberFields.Fields = numberFields.Fields.concat([
                CreateNumberFieldFormFields.AllowFloatingField(),
                CreateNumberFieldFormFields.MinValueField(),
                CreateNumberFieldFormFields.MaxValueField()
            ]);
            return numberFields;
        }

        private static AllowFloatingField():Models.BooleanFieldMetadata {
            var result = new Models.BooleanFieldMetadata();
            result.FieldSystemName = 'AllowFloating';
            result.FieldName = Services.LocalizationService.Resources.AllowFloating;
            result.FieldDescription = result.FieldName;
            result.Required = true;
            return result;
        }

        private static MinValueField():Models.NumberFieldMetadata {
            var result = new Models.NumberFieldMetadata();
            result.FieldSystemName = 'MinValue';
            result.FieldName = Services.LocalizationService.Resources.MinValue;
            result.FieldDescription = result.FieldName;
            result.AllowFloating = true;
            return result;
        }

        private static MaxValueField():Models.NumberFieldMetadata {
            var result = new Models.NumberFieldMetadata();
            result.FieldSystemName = 'MaxValue';
            result.FieldName = Services.LocalizationService.Resources.MaxValue;
            result.FieldDescription = result.FieldName;
            result.AllowFloating = true;
            return result;
        }
    }
}
