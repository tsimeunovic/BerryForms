/// <reference path="../../jasmine.d.ts" />

'use strict';

module Mocks {
    export class ScopeMock {
        constructor() {
            this.Setup();
        }

        private Setup():void {
            spyOn(this, '$apply').and.callThrough();
            spyOn(this, '$on').and.callThrough();
        }

        //Mock members
        public $apply(applyFunc:()=>void):void {}
        public $on(eventName:string, onFunction:()=>void):void {}
    }

    export class RootScopeMock extends ScopeMock {
    }
}
