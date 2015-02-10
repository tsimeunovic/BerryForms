/// <reference path="../../../directives/fieldDirectiveBase.ts" />
/// <reference path="../../../../config/config.ts" />

'use strict';

module Directives {
    export class SelectField extends Directives.BaseField {
        public static injection():any[] {
            return [
                '$timeout',
                SelectField.DirectiveOptions
            ];
        }

        private static TimeoutService;

        public static DirectiveOptions(Timeout:any):any {
            SelectField.TimeoutService = Timeout;
            return BaseField.DirectiveOptions("Select", SelectField.StaticConstructor);
        }

        public static StaticConstructor():Directives.SelectField {
            return new Directives.SelectField();
        }

        private ToggleButton:any;

        public Link($scope:any, $linkElement:any, $linkAttributes:any):void {
            super.Link($scope, $linkElement, $linkAttributes);

            //Setup dropdown toggle
            this.SetupToggle($linkElement);

            //Add select function to scope
            this.Scope.SelectOption = this.SelectOption.bind(this);

            //Assert model data
            var fieldSystemName:string = this.Scope.field.FieldSystemName;
            this.Scope.Entity.Data[fieldSystemName] =
                this.Scope.Entity.Data[fieldSystemName] ||
                this.Scope.field.DefaultValue ||
                new Models.SelectFieldOptionMetadata('', '');
        }

        private SetupToggle(rootElement:any):void {
            //Custom expand functionality to avoid using bootstrap.js
            if (rootElement.length > 0) rootElement = rootElement[0];
            this.ToggleButton = rootElement.querySelector('.dropdown-toggle');
            this.ToggleButton.setAttribute('tabindex', '0');
            this.ToggleButton.onclick = this.ToggleDropdown.bind(this);
            this.ToggleButton.onblur = this.CloseDropdown.bind(this);
        }

        private SelectOption($event:any, option:string):void {
            this.Scope.Entity.Data[this.Scope.field.FieldSystemName] = option;
            this.Scope.IsOpened = false;
        }

        private ToggleDropdown($event):boolean {
            this.Scope.IsOpened = !this.Scope.IsOpened;
            //Fix Firefox and IE different handling of focus and blur
            if (this.Scope.IsOpened) this.ToggleButton.focus();
            return this.ApplyOpenedValue();
        }

        private CloseDropdown($event):boolean {
            this.Scope.IsOpened = false;
            return this.ApplyOpenedValue();
        }

        private ApplyOpenedValue():boolean {
            SelectField.TimeoutService(function () {
            }, true);
            return false;
        }
    }
}
