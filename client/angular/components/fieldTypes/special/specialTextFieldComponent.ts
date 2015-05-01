/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../../data/createFieldFormFields.ts" />
/// <reference path="../text/textFieldFormFields.ts" />
/// <reference path="../text/textFieldComponent.ts" />

//Special type of text field (for email, phone number, etc ...)
module Components.FieldTypes {
    'use strict';

    export class SpecialTextFieldComponent extends TextFieldComponent implements IFieldType {
        constructor(fieldName:string,
                    symbol:string,
                    regularExpression:string) {
            super();
            this.FieldName = fieldName;
            this.Symbol = symbol;
            this.RegularExpression = regularExpression;
            this.DirectiveName = ('field{0}').format([this.FieldName]);
        }

        public FieldName:string;
        public Symbol:string;
        public RegularExpression:string;

        //Metadata model
        public CreateMetadata():Models.FieldMetadata {
            var textMetadata:Models.TextFieldMetadata = new Models.TextFieldMetadata();
            textMetadata.Symbol = this.Symbol;
            textMetadata.RegularExpression = this.RegularExpression;
            return textMetadata;
        }

        //Field creation form
        public CreateFieldForm():Models.EntityMetadata {
            var regularExpressionPredicate:(f:Models.FieldMetadata) => boolean = function (field:Models.FieldMetadata):boolean {
                return field.FieldSystemName === 'RegularExpression';
            };

            var textFields:Models.EntityMetadata = Data.CreateTextFieldFormFields.GetData();
            var regularExpressionField:Models.FieldMetadata = textFields.Fields.single(regularExpressionPredicate);
            textFields.Fields.remove(regularExpressionField);
            return textFields;
        }
    }
}

/* tslint:disable:max-line-length */
_global.Components.FieldTypes.push(new Components.FieldTypes.SpecialTextFieldComponent('Email', 'envelope', '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'));
