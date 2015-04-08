/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../../data/createFieldFormFields.ts" />
/// <reference path="../text/textFieldFormFields.ts" />
/// <reference path="../text/textFieldComponent.ts" />

'use strict';

//Special type of text field (for email, phone number, etc ...)
module Components.FieldTypes {
    export class SpecialTextFieldComponent extends TextFieldComponent implements IFieldType {
        constructor(public FieldName:string,
                    public Symbol:string,
                    public RegularExpression:string) {
            super();
            this.DirectiveName = ('field{0}').format([this.FieldName]);
        }

        //Metadata model
        CreateMetadata():Models.FieldMetadata {
            var textMetadata = new Models.TextFieldMetadata();
            textMetadata.Symbol = this.Symbol;
            textMetadata.RegularExpression = this.RegularExpression;
            return textMetadata;
        }

        //Field creation form
        CreateFieldForm():Models.EntityMetadata {
            var regularExpressionPredicate = function(field:Models.FieldMetadata):boolean {
                return field.FieldSystemName === 'RegularExpression';
            };

            var textFields = Data.CreateTextFieldFormFields.GetData();
            var regularExpressionField:Models.FieldMetadata = textFields.Fields.single(regularExpressionPredicate);
            textFields.Fields.remove(regularExpressionField);
            return textFields;
        }
    }
}

_global.Components.FieldTypes.push(new Components.FieldTypes.SpecialTextFieldComponent('Email', 'envelope', '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'));
