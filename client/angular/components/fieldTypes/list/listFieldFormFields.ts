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
    export class CreateListFieldFormFields {
        public static GetData():Models.EntityMetadata {
            var listFields = Data.CreateFieldFormFields.GetData(null);
            listFields.Fields = listFields.Fields.concat([
                CreateListFieldFormFields.MaxRecordsCountField(),
                CreateListFieldFormFields.MaxRecordLengthField()
            ]);
            return listFields;
        }

        private static MaxRecordsCountField():Models.TextFieldMetadata {
            var result = new Models.TextFieldMetadata();
            result.FieldSystemName = 'MaxRecordsCount';
            result.FieldName = Services.LocalizationService.Resources.MaxRecordsCount;
            result.FieldDescription = result.FieldName;
            result.RegularExpression = '^[0-9]{0,2}$';
            return result;
        }

        private static MaxRecordLengthField():Models.TextFieldMetadata {
            var result = new Models.TextFieldMetadata();
            result.FieldSystemName = 'MaxRecordLength';
            result.FieldName = Services.LocalizationService.Resources.MaxRecordLength;
            result.FieldDescription = result.FieldName;
            result.RegularExpression = '^[0-9]{0,2}$';
            return result;
        }
    }
}
