/// <reference path="../../jasmine.d.ts" />
/// <reference path="../page-objects/button.ts" />
/// <reference path="../page-objects/formControl.ts" />

module PageObjects {
    'use strict';

    export class Toaster {
        constructor(private Type:string) {
            this.ToastSelector = this.Type ? ('.toast.toast-{0}').format([this.Type]) : '.toast';
            this.ToastScopeName = 'Toaster';
        }

        private ToastSelector:string;
        private ToastScopeName:string;

        public static Current(type:string):PageObjects.Toaster {
            return new PageObjects.Toaster(type);
        }

        public GetMessage(withClosing:boolean):any {
            var messageDivSelector:string = '.toast-message div';
            var future:any = using(this.ToastSelector, this.ToastScopeName).element(messageDivSelector).text();
            if (withClosing) {
                this.Close();
            }
            return future;
        }

        public Close():void {
            var closeButtonSelector:string = '.toast-close-button';
            using(this.ToastSelector, this.ToastScopeName).element(closeButtonSelector).click();
        }
    }
}
