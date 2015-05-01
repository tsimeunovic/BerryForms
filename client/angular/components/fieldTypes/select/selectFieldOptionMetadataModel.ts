//Represents item in dropdown menu (select HTML element)
module Models {
    'use strict';

    export class SelectFieldOptionMetadata {
        constructor(text:string, value:string) {
            this.Value = value || text;
            this.Text = text || value;
        }

        public Value:string;
        public Text:string;
    }
}
