/// <reference path="../../jasmine.d.ts" />

'use strict';

module Mocks {
    export class CallbackMock {
        constructor() {
            this.Setup();
        }

        private Setup():void {
            spyOn(this, 'callback');
        }

        //Mock members
        public callback():void {}
    }
}
