/// <reference path="../../jasmine.d.ts" />

'use strict';

module PageObjects {
    export class ConfirmDialog {
        constructor() {
            this.DialogSelector = '.dialog.confirm';
            this.DialogScopeName = 'ConfirmDialog';
        }

        private DialogSelector:string;
        private DialogScopeName:string;

        public Confirm():void {
            var confirmButtonSelector = '.btn-warning';
            using(this.DialogSelector, this.DialogScopeName).element(confirmButtonSelector).click();
        }

        public Cancel():void {
            var cancelButtonSelector = '.btn-default';
            using(this.DialogSelector, this.DialogScopeName).element(cancelButtonSelector).click();
        }

        public static Current():PageObjects.ConfirmDialog {
            return new PageObjects.ConfirmDialog();
        }
    }
}
