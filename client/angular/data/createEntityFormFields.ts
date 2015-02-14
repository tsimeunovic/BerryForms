/// <reference path="../models/entityMetadataModel.ts" />
/// <reference path="../components/fieldTypes/boolean/booleanFieldMetadataModel.ts" />
/// <reference path="../components/fieldTypes/date/dateFieldMetadataModel.ts" />
/// <reference path="../components/fieldTypes/list/listFieldMetadataModel.ts" />
/// <reference path="../components/fieldTypes/select/selectFieldMetadataModel.ts" />
/// <reference path="../components/fieldTypes/textarea/textareaFieldMetadataModel.ts" />
/// <reference path="../components/fieldTypes/text/textFieldMetadataModel.ts" />
/// <reference path="../interfaces/localization/IResources.ts" />
/// <reference path="../services/localization/localizationService.ts" />
/// <reference path="../../config/config.ts" />

'use strict';

//Class responsible for creating form components for new entity type
module Data {
    export class CreateEntityFormFields {
        public static GetData():Models.EntityMetadata {
            var result:Models.EntityMetadata = new Models.EntityMetadata();
            result.EntityName = Config.Client.SystemEntityName;
            result.Fields = [
                this.EntityNameField(),
                this.EntityDescriptionField(),
                this.EntityColorField(),
                this.EntityIconField()
            ];
            return result;
        }

        private static EntityNameField():Models.TextFieldMetadata{
            var result = new Models.TextFieldMetadata();
            result.FieldSystemName = 'EntityName';
            result.FieldName = Services.LocalizationService.Resources.EntityName;
            result.FieldDescription = result.FieldName;
            result.Required = true;
            result.RegularExpression = '^[a-zA-Z\\u00C0-\\u017F0-9 ]*$';

            return result;
        }

        private static EntityDescriptionField():Models.TextFieldMetadata{
            var result = new Models.TextFieldMetadata();
            result.FieldSystemName = 'EntityDescription';
            result.FieldName =  Services.LocalizationService.Resources.EntityDescription;
            result.FieldDescription = result.FieldName;
            result.MaxLength = 100;

            return result;
        }

        private static EntityColorField():Models.SelectFieldMetadata{
            var result = new Models.SelectFieldMetadata();
            result.FieldSystemName = 'IconColorHex';
            result.FieldName = Services.LocalizationService.Resources.EntityColor;
            result.FieldDescription = result.FieldName;
            result.Values = [
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.ColorDefault, Config.Client.SystemColorIdentifier),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.ColorKhaki, Config.Client.SystemColorIdentifier + '#DAD4BE'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.ColorGray, Config.Client.SystemColorIdentifier + '#D3D2D5'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.ColorLightPurple, Config.Client.SystemColorIdentifier + '#F5F1F2'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.ColorPurple, Config.Client.SystemColorIdentifier + '#EADCE0'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.ColorDarkPurple, Config.Client.SystemColorIdentifier + '#C8AEB4'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.ColorOrange, Config.Client.SystemColorIdentifier + '#FFECC5'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.ColorViolet, Config.Client.SystemColorIdentifier + '#D6C8FA'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.ColorBlue, Config.Client.SystemColorIdentifier + '#C8D3FA'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.ColorBrown, Config.Client.SystemColorIdentifier + '#DEC0BA')
            ];
            result.Required = true;

            return result;
        }

        private static EntityIconField():Models.SelectFieldMetadata{
            var result = new Models.SelectFieldMetadata();
            result.FieldSystemName = 'IconClassName';
            result.FieldName = Services.LocalizationService.Resources.EntityIcon;
            result.FieldDescription = result.FieldName;
            result.Values = [
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconEuro, Config.Client.SystemIconIdentifier + 'euro'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconCloud, Config.Client.SystemIconIdentifier + 'cloud'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconEnvelope, Config.Client.SystemIconIdentifier + 'envelope'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconPencil, Config.Client.SystemIconIdentifier + 'pencil'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconMusic, Config.Client.SystemIconIdentifier + 'music'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconHeart, Config.Client.SystemIconIdentifier + 'heart'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconStar, Config.Client.SystemIconIdentifier + 'star'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconUser, Config.Client.SystemIconIdentifier + 'user'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconOk, Config.Client.SystemIconIdentifier + 'ok'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconRemove, Config.Client.SystemIconIdentifier + 'remove'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconSearch, Config.Client.SystemIconIdentifier + 'search'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconSignal, Config.Client.SystemIconIdentifier + 'signal'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconCog, Config.Client.SystemIconIdentifier + 'cog'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconHome, Config.Client.SystemIconIdentifier + 'home'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconTime, Config.Client.SystemIconIdentifier + 'time'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconRoad, Config.Client.SystemIconIdentifier + 'road'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconEuro, Config.Client.SystemIconIdentifier + 'euro'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconBarcode, Config.Client.SystemIconIdentifier + 'barcode'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconPrint, Config.Client.SystemIconIdentifier + 'print'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconLeaf, Config.Client.SystemIconIdentifier + 'leaf'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconFire, Config.Client.SystemIconIdentifier + 'fire'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconPlane, Config.Client.SystemIconIdentifier + 'plane'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconGlobe, Config.Client.SystemIconIdentifier + 'globe'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconPaperclip, Config.Client.SystemIconIdentifier + 'paperclip'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconCutlery, Config.Client.SystemIconIdentifier + 'cutlery'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconBriefcase, Config.Client.SystemIconIdentifier + 'briefcase'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconCalendar, Config.Client.SystemIconIdentifier + 'calendar'),
                new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources.IconFilm, Config.Client.SystemIconIdentifier + 'film')
            ];
            result.Required = true;

            return result;
        }
    }
}
