/// <reference path="../boolean/booleanFieldMetadataModel.ts" />
/// <reference path="../date/dateFieldMetadataModel.ts" />
/// <reference path="../list/listFieldMetadataModel.ts" />
/// <reference path="../select/selectFieldMetadataModel.ts" />
/// <reference path="../textarea/textareaFieldMetadataModel.ts" />
/// <reference path="../text/textFieldMetadataModel.ts" />
/// <reference path="./../../../data/createFieldFormFields.ts" />
/// <reference path="../../../models/entityMetadataModel.ts" />
/// <reference path="../../../interfaces/localization/IResources.ts" />
/// <reference path="../../../services/localization/localizationService.ts" />
/// <reference path="../../../../config/config.ts" />

'use strict';

module Data {
    export class CreateSelectFieldFormFields {
        public static GetData():Models.EntityMetadata {
            var selectFields = Data.CreateFieldFormFields.GetData(null);
            selectFields.Fields = selectFields.Fields.concat([
                CreateSelectFieldFormFields.ValuesField(),
                CreateSelectFieldFormFields.DefaultValueField()
            ]);
            return selectFields;
        }

        private static ValuesField():Models.ListFieldMetadata {
            var result = new Models.ListFieldMetadata();
            result.FieldSystemName = 'Values';
            result.FieldName = Services.LocalizationService.Resources.Values;
            result.FieldDescription = result.FieldName;
            result.Required = true;
            return result;
        }

        private static DefaultValueField():Models.TextFieldMetadata {
            var result = new Models.TextFieldMetadata();
            result.FieldSystemName = 'DefaultValue';
            result.FieldName = Services.LocalizationService.Resources.DefaultValue;
            result.FieldDescription = result.FieldName;
            result.Required = false;
            return result;
        }
    }
}
