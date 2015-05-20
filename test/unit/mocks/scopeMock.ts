/// <reference path="../../jasmine.d.ts" />

module Mocks {
    'use strict';

    export class ScopeMock {
        constructor() {
            this.Setup();
        }

        //Mock members
        public $apply(applyFunc:() => void):void {
            //Do nothing
        }

        public $on(eventName:string, onFunction:() => void):void {
            //Do nothing
        }

        private Setup():void {
            spyOn(this, '$apply').and.callThrough();
            spyOn(this, '$on').and.callThrough();
        }
    }

    export class RootScopeMock extends ScopeMock {
    }
}
