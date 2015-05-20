/// <reference path="../../jasmine.d.ts" />

module Mocks {
    'use strict';

    export class LocationMock {
        constructor() {
            this.Setup();
        }

        //Mock members
        public path(url:string):any {
            //Do nothing
        }

        public search(expression:string):any {
            //Do nothing
        }

        private Setup():void {
            spyOn(this, 'path').and.returnValue(this);
            spyOn(this, 'search').and.returnValue(this);
        }
    }
}
