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

    export class CreateListFieldFormFields {
        public static GetData():Models.EntityMetadata {
            var listFields:Models.EntityMetadata = Data.CreateFieldFormFields.GetData(null);
            listFields.Fields = listFields.Fields.concat([
                CreateListFieldFormFields.MaxRecordsCountField(),
                CreateListFieldFormFields.MaxRecordLengthField()
            ]);
            return listFields;
        }

        private static MaxRecordsCountField():Models.NumberFieldMetadata {
            var result:Models.NumberFieldMetadata = new Models.NumberFieldMetadata();
            result.FieldSystemName = 'MaxRecordsCount';
            result.FieldName = Services.LocalizationService.Resources.MaxRecordsCount;
            result.FieldDescription = result.FieldName;
            result.AllowFloating = false;
            result.MinValue = 1;
            result.MaxValue = 128;
            return result;
        }

        private static MaxRecordLengthField():Models.NumberFieldMetadata {
            var result:Models.NumberFieldMetadata = new Models.NumberFieldMetadata();
            result.FieldSystemName = 'MaxRecordLength';
            result.FieldName = Services.LocalizationService.Resources.MaxRecordLength;
            result.FieldDescription = result.FieldName;
            result.AllowFloating = false;
            result.MinValue = 1;
            result.MaxValue = 1024;
            return result;
        }
    }
}
