/// <reference path="../../jasmine.d.ts" />

module PageObjects {
    'use strict';

    export class ConfirmDialog {
        constructor() {
            this.DialogSelector = '.dialog.confirm';
            this.DialogScopeName = 'ConfirmDialog';
        }

        private DialogSelector:string;
        private DialogScopeName:string;

        public static Current():PageObjects.ConfirmDialog {
            return new PageObjects.ConfirmDialog();
        }

        public Confirm():void {
            var confirmButtonSelector:string = '.btn-warning';
            using(this.DialogSelector, this.DialogScopeName).element(confirmButtonSelector).click();
        }

        public Cancel():void {
            var cancelButtonSelector:string = '.btn-default';
            using(this.DialogSelector, this.DialogScopeName).element(cancelButtonSelector).click();
        }
    }
}
