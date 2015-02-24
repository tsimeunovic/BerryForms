/// <reference path="../../../directives/fieldDirectiveBase.ts" />
/// <reference path="../../../../config/config.ts" />

'use strict';

module Directives {
    export class SelectField extends Directives.BaseField {
        public static injection():any[] {
            return [
                '$document',
                SelectField.DirectiveOptions
            ];
        }

        private static Document:any;

        public static DirectiveOptions(Document:any):any {
            SelectField.Document = Document;
            return BaseField.DirectiveOptions("Select", SelectField.StaticConstructor);
        }

        public static StaticConstructor():Directives.SelectField {
            return new Directives.SelectField();
        }

        public Link($scope:any, $linkElement:any, $linkAttributes:any):void {
            super.Link($scope, $linkElement, $linkAttributes);

            //Find toggle
            var rootElement = $linkElement;
            if (rootElement.length > 0) rootElement = rootElement[0];
            this.ToggleButton = rootElement.querySelector('.dropdown-toggle');

            //Add select function to scope
            this.Scope.Opened = false;
            this.Scope.ToggleOpen = this.ToggleOpen.bind(this);
            this.Scope.SelectOption = this.SelectOption.bind(this);

            //Assert model data
            var fieldSystemName:string = this.Scope.field.FieldSystemName;
            this.Scope.Entity.Data[fieldSystemName] =
                this.Scope.Entity.Data[fieldSystemName] ||
                this.Scope.field.DefaultValue ||
                new Models.SelectFieldOptionMetadata('', '');

            //Setup watch
            this.WatchOpened();
        }

        private ToggleButton:any;

        private ToggleOpen($event:any):void {
            $event.preventDefault();
            $event.stopPropagation();
            this.Scope.Opened = !this.Scope.Opened;
        }

        private SelectOption($event:any, option:string):void {
            this.Scope.Entity.Data[this.Scope.field.FieldSystemName] = option;
            this.Scope.Opened = false;
        }

        private WatchOpened():void {
            var _this = this;
            this.Scope.$watch('Opened', function (value) {
                var bindUnbindMethod:string = value ? 'bind' : 'unbind';
                SelectField.Document[bindUnbindMethod]('click', _this.DocumentClick.bind(_this));
            });
        }

        private DocumentClick(event):void {
            if (!this.Scope.Opened || event.target === this.ToggleButton) return;
            this.Scope.Opened = false;
            this.Scope.$apply(function () {});
        }
    }
}
