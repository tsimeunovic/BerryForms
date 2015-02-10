/// <reference path="../../jasmine.d.ts" />
/// <reference path="../page-objects/button.ts" />
/// <reference path="../page-objects/formControl.ts" />

'use strict';

module PageObjects {
    export class Toaster {
        constructor(private Type:string) {
            this.ToastSelector = this.Type ? ('.toast.toast-{0}').format([this.Type]) : '.toast';
            this.ToastScopeName = 'Toaster';
        }

        private ToastSelector:string;
        private ToastScopeName:string;

        public GetMessage(withClosing:boolean):any {
            var messageDivSelector = '.toast-message div';
            var future = using(this.ToastSelector, this.ToastScopeName).element(messageDivSelector).text();
            if (withClosing) this.Close();
            return future;
        }

        public Close():void {
            var closeButtonSelector = '.toast-close-button';
            using(this.ToastSelector, this.ToastScopeName).element(closeButtonSelector).click();
        }

        public static Current(type:string):PageObjects.Toaster {
            return new PageObjects.Toaster(type);
        }
    }
}
