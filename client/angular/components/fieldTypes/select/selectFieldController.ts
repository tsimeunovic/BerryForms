/// <reference path="./selectFieldMetadataModel.ts" />
/// <reference path="../baseFieldController.ts" />
/// <reference path="../../../models/core/EntityModel.ts" />

module Components.FieldTypes {
    'use strict';

    export class SelectFieldController extends BaseFieldController<Models.SelectFieldMetadata> {
        /* tslint:disable:member-ordering */
        public static injection():any[] {
            return [
                '$scope',
                '$document',
                SelectFieldController
            ];
        }

        constructor(Scope:any,
                    private Document:any) {
            super(Scope);
            this.Watch();
        }

        private Opened:boolean;

        /* tslint:disable:no-unused-variable */
        private ToggleOpen($event:any):void {
            $event.preventDefault();
            $event.stopPropagation();
            this.Opened = !this.Opened;
            this.UpdateDocumentClickHandler();
        }

        /* tslint:disable:no-unused-variable */
        private SelectOption($event:any, option:string):void {
            this.Entity.Data[this.FieldMetadata.FieldSystemName] = option;
            this.Opened = false;
            this.UpdateDocumentClickHandler();
        }

        private Watch():void {
            var _this:SelectFieldController = this;
            this.SetInitialData();
            this.Scope.$watch('Entity.Data[field.FieldSystemName]', function ():void {
                _this.SetInitialData();
            });
        }

        private SetInitialData():void {
            //Assert initialized model data
            var fieldSystemName:string = this.FieldMetadata.FieldSystemName;
            if (this.Entity.Data[fieldSystemName]) {
                return;
            }
            this.Entity.Data[fieldSystemName] =
                this.Entity.Data[fieldSystemName] ||
                this.FieldMetadata.DefaultValue ||
                new Models.SelectFieldOptionMetadata('', '');
        }

        private UpdateDocumentClickHandler():void {
            var bindUnbindMethod:string = this.Opened ? 'bind' : 'unbind';
            this.Document[bindUnbindMethod]('click', this.DocumentClick.bind(this));
        }

        private DocumentClick(event:any):void {
            if (!this.Opened || (event.target && event.target.className.indexOf('dropdown-toggle') > -1)) {
                return;
            }

            this.Opened = false;
            this.UpdateDocumentClickHandler();

            this.Scope.$apply(function ():void {
                //Nothing to apply, just run digest to detect opened dropdown
            });
        }
    }
}
