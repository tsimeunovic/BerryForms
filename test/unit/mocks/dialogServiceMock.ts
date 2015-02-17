/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/interaction/IDialogService.ts" />

'use strict';

module Mocks {
    export class DialogServiceMock implements Services.IDialogService {
        constructor() {
            this.Setup();
        }

        private Setup():void {
            spyOn(this, 'CreateConfirmationDialog').and.callThrough();
            spyOn(this, 'RemoveDialog').and.callThrough();
        }

        private ShouldCancelNextDialog:boolean;
        public CancelNextDialog() {
            this.ShouldCancelNextDialog = true;
        }

        //Mock members
        public CreateConfirmationDialog(confirmationText:string, callback:(result:boolean)=>void): void {
            var dialogResult:boolean = !this.ShouldCancelNextDialog;
            this.ShouldCancelNextDialog = false;
            callback(dialogResult);
        }

        public RemoveDialog():void {
        }
    }
}
