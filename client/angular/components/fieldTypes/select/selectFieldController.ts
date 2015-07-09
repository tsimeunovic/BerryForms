/// <reference path="./selectFieldMetadataModel.ts" />
/// <reference path="../baseFieldController.ts" />
/// <reference path="../../../models/core/entityModel.ts" />

module Components.FieldTypes {
    'use strict';

    export class SelectFieldController extends BaseFieldController<Models.SelectFieldMetadata> {
        //@ngInject
        constructor($scope:any,
                    $document:any) {
            super($scope);
            this.Document = $document;
            this.EntityValueChangedEvent = this.SetInitialData.bind(this);
            this.SetInitialData();
        }

        public Opened:boolean;
        private Document:any;

        public ToggleOpen($event:any):void {
            this.StopEventPropagation($event);
            this.Opened = !this.Opened;
            this.UpdateDocumentClickHandler();
        }

        public SelectOption($event:any, option:Models.SelectFieldOptionMetadata):void {
            //Event propagation is intentionally not stopped to close dialog
            this.SetBoundFieldValue(option);
            this.Opened = false;
            this.UpdateDocumentClickHandler();
        }

        private SetInitialData():void {
            //Assert initialized model data
            if (this.GetBoundFieldValue()) {
                return;
            }

            this.SetBoundFieldValue(this.GetBoundFieldValue() ||
                this.FieldMetadata.DefaultValue ||
                new Models.SelectFieldOptionMetadata('', ''));
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
            this.ApplyChanges();
        }
    }
}
