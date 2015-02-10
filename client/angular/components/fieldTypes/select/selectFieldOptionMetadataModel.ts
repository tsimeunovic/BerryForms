'use strict';

module Models {
    export class SelectFieldOptionMetadata {
        constructor(text:string, value:string)
        {
            this.Value = value || text;
            this.Text = text || value;
        }

        public Value: string;
        public Text: string;
    }
}
