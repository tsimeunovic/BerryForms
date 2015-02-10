/// <reference path="../../jasmine.d.ts" />

'use strict';

module Mocks {
    export class LocationMock {
        constructor() {
            this.Setup();
        }

        private Setup():void {
            spyOn(this, 'path').and.returnValue(this);
            spyOn(this, 'search').and.returnValue(this);
        }

        //Mock members
        public path(url:string):any {}
        public search(expression:string):any {}
    }
}
