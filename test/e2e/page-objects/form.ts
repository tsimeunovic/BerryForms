/// <reference path="../../jasmine.d.ts" />
/// <reference path="../page-objects/button.ts" />
/// <reference path="../page-objects/formControl.ts" />

module PageObjects {
    'use strict';

    export class Form {
        constructor(private ScopeSelector:string) {
            this.Controls = [];
            this.SubmitButton = new PageObjects.Button(this.ScopeSelector + ' div.entityForm button.btn-submit');
            this.FormFields = using(this.ScopeSelector + ' [data-role="form"]', 'Form').element('.fieldComponent');
        }

        public FormFields:any;
        public SubmitButton:PageObjects.Button;

        private Controls:PageObjects.FormControl[];

        public static Current():PageObjects.Form {
            return new PageObjects.Form('');
        }

        public static In(scopeSelector:string):PageObjects.Form {
            return new PageObjects.Form(scopeSelector);
        }

        public FillAndSubmit(formData:any[]):void {
            this.Fill(formData);
            this.Submit();
        }

        public Fill(formData:any[]):void {
            for (var i:number = 0; i < formData.length; i++) {
                var controlData:any = formData[i];
                var control:PageObjects.FormControl = new PageObjects.FormControl(controlData.Name, controlData.Type);
                this.Controls.push(control);
                control.SetValue(controlData.Value);
            }
        }

        public FieldFor(propertyName:string):any {
            var elementSelector:string = ('[data-id="{0}"]').format([propertyName]);
            return using(this.ScopeSelector + ' [data-role="form"]', 'Form').element(elementSelector);
        }

        public Submit():void {
            this.SubmitButton.Click();
        }
    }
}
