/// <reference path="../Models/entityMetadataModel.ts" />
/// <reference path="../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../components/fieldTypes/text/textFieldFormFields.ts" />
/// <reference path="../components/fieldTypes/textarea/textareaFieldFormFields.ts" />
/// <reference path="../components/fieldTypes/boolean/booleanFieldFormFields.ts" />
/// <reference path="../components/fieldTypes/date/dateFieldFormFields.ts" />
/// <reference path="../components/fieldTypes/select/selectFieldFormFields.ts" />
/// <reference path="../components/fieldTypes/list/listFieldFormFields.ts" />
/// <reference path="../components/fieldTypes/boolean/booleanFieldMetadataModel.ts" />
/// <reference path="../components/fieldTypes/date/dateFieldMetadataModel.ts" />
/// <reference path="../components/fieldTypes/list/listFieldMetadataModel.ts" />
/// <reference path="../components/fieldTypes/select/selectFieldMetadataModel.ts" />
/// <reference path="../components/fieldTypes/textarea/textareaFieldMetadataModel.ts" />
/// <reference path="../components/fieldTypes/text/textFieldMetadataModel.ts" />
/// <reference path="../interfaces/localization/IResources.ts" />
/// <reference path="../services/localization/localizationService.ts" />
/// <reference path="../../extensions/arrayExtensions.ts" />
/// <reference path="../../config/config.ts" />

'use strict';
var _global:any = this;
declare var angular:any;

//Class responsible for creating form components for new entity type field
module Data {
    export class CreateFieldFormFields {
        public static GetData(fieldType:string, entityEdit:boolean = false):Models.EntityMetadata {
            var result:Models.EntityMetadata;
            if (fieldType) result = this.GetFieldData(fieldType);
            else result = this.GetInitialData();

            if(entityEdit) {
                //Mark immutable fields as read-only
                var nameFieldPredicate = function(field:Models.FieldMetadata) {
                    return field.FieldSystemName == 'FieldName';
                };
                var nameField:Models.FieldMetadata = result.Fields.single(nameFieldPredicate);
                nameField.ReadOnly = true;
            }
            return result;
        }

        private static GetInitialData():Models.EntityMetadata {
            var result:Models.EntityMetadata = new Models.EntityMetadata();
            result.EntityName = Config.Client.SystemEntityName;
            result.Fields = [
                this.FieldNameField(),
                this.FieldDescriptionField(),
                this.FieldTypeNameField(),
                this.FieldRequiredField(),
                this.FieldDisplayInListNameField()
            ];
            return result;
        }

        private static GetFieldData(fieldType:string):Models.EntityMetadata {
            var registeredFieldTypes:Components.FieldTypes.IFieldType[] = _global.Components.FieldTypes;
            var fieldTypePredictor = function (a:Components.FieldTypes.IFieldType) {
                return a.FieldName == fieldType;
            };
            var fieldTypeComponent:Components.FieldTypes.IFieldType = registeredFieldTypes.single(fieldTypePredictor);

            if (!fieldTypeComponent) throw new Error();
            else return fieldTypeComponent.CreateFieldForm();
        }

        private static FieldTypeNameField():Models.SelectFieldMetadata {
            var result = new Models.SelectFieldMetadata();
            result.FieldSystemName = 'FieldTypeName';
            result.FieldName = Services.LocalizationService.Resources.FieldTypeName;
            result.FieldDescription = result.FieldName;
            result.Required = true;

            result.Values = [];
            angular.forEach(_global.Components.FieldTypes, function(value:Components.FieldTypes.IFieldType) {
                var fieldTypeOptionModel = new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources[value.FieldName + 'Field'], value.FieldName);
                result.Values.push(fieldTypeOptionModel);
            });

            return result;
        }

        private static FieldNameField():Models.TextFieldMetadata {
            var result = new Models.TextFieldMetadata();
            result.FieldSystemName = 'FieldName';
            result.FieldName = Services.LocalizationService.Resources.FieldName;
            result.DisplayInListName = true;
            result.FieldDescription = result.FieldName;
            result.Required = true;
            result.RegularExpression = '^[a-zA-Z\\u00C0-\\u017F0-9 ]*$';

            return result;
        }

        private static FieldDescriptionField():Models.TextFieldMetadata {
            var result = new Models.TextFieldMetadata();
            result.FieldSystemName = 'FieldDescription';
            result.FieldName = Services.LocalizationService.Resources.FieldDescription;
            result.DisplayInListName = true;
            result.FieldDescription = result.FieldName;
            result.MaxLength = 100;

            return result;
        }

        private static FieldRequiredField():Models.BooleanFieldMetadata {
            var result = new Models.BooleanFieldMetadata();
            result.FieldSystemName = 'Required';
            result.FieldName = Services.LocalizationService.Resources.Required;
            result.FieldDescription = result.FieldName;
            result.ThreeState = false;
            result.Required = true;

            return result;
        }

        private static FieldDisplayInListNameField():Models.BooleanFieldMetadata {
            var result = new Models.BooleanFieldMetadata();
            result.FieldSystemName = 'DisplayInListName';
            result.FieldName = Services.LocalizationService.Resources.DisplayInList;
            result.FieldDescription = result.FieldName;
            result.ThreeState = false;
            result.Required = true;

            return result;
        }
    }
}
