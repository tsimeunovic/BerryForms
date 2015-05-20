/// <reference path="../../jasmine.d.ts" />

module Mocks {
    'use strict';

    export class CallbackMock {
        constructor() {
            this.Setup();
        }

        //Mock members
        public callback():void {
            //Do nothing
        }

        private Setup():void {
            spyOn(this, 'callback');
        }
    }
}
