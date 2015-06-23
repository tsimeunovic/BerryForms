/// <reference path="../../jasmine.d.ts" />

module Mocks {
    'use strict';

    export class DocumentMock {
        constructor() {
            this.Setup();
        }

        //Mock members
        public bind(eventName:string, onFunction:(event:any) => void):void {
            //Do nothing
        }

        public unbind(eventName:string, onFunction:(event:any) => void):void {
            //Do nothing
        }

        private Setup():void {
            spyOn(this, 'bind').and.callThrough();
            spyOn(this, 'unbind').and.callThrough();
        }
    }
}
