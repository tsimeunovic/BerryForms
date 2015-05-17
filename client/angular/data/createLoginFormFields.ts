/// <reference path="../models/core/entityMetadataModel.ts" />
/// <reference path="../components/fieldTypes/boolean/booleanFieldMetadataModel.ts" />
/// <reference path="../components/fieldTypes/date/dateFieldMetadataModel.ts" />
/// <reference path="../components/fieldTypes/list/listFieldMetadataModel.ts" />
/// <reference path="../components/fieldTypes/select/selectFieldMetadataModel.ts" />
/// <reference path="../components/fieldTypes/textarea/textareaFieldMetadataModel.ts" />
/// <reference path="../components/fieldTypes/text/textFieldMetadataModel.ts" />
/// <reference path="../interfaces/localization/IResources.ts" />
/// <reference path="../services/localization/localizationService.ts" />
/// <reference path="../../config/config.ts" />

//Class responsible for creating form components for login screen
module Data {
    'use strict';

    export class CreateLoginFormFields {
        public static GetData():Models.EntityMetadata {
            var result:Models.EntityMetadata = new Models.EntityMetadata();
            result.EntityName = Config.Client.SystemEntityName;
            result.Fields = [
                this.UserNameField(),
                this.PasswordField()
            ];
            return result;
        }

        private static UserNameField():Models.TextFieldMetadata {
            var result:Models.TextFieldMetadata = new Models.TextFieldMetadata();
            result.FieldSystemName = 'UserName';
            result.FieldName = Services.LocalizationService.Resources.UserName;
            result.FieldDescription = result.FieldName;
            result.Required = true;
            result.RegularExpression = '^[a-zA-Z0-9]{4,12}$';

            return result;
        }

        private static PasswordField():Models.TextFieldMetadata {
            var result:Models.TextFieldMetadata = new Models.TextFieldMetadata();
            result.FieldSystemName = 'Password';
            result.FieldName = Services.LocalizationService.Resources.Password;
            result.FieldDescription = result.FieldName;
            result.Required = true;
            result.MaskCharacters = true;
            result.RegularExpression = '^[a-zA-Z]\\w{4,12}$';

            return result;
        }
    }
}
