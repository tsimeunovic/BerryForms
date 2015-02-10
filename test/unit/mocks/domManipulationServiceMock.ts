/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/interaction/IDomManipulationService.ts" />

'use strict';

module Mocks {
    export class DomManipulationServiceMock implements Services.IDomManipulationService {
        constructor() {
            this.Setup();
        }

        private Setup():void {
            spyOn(this, 'ScrollToTop').and.callThrough();
        }

        //Mock members
        public ScrollToTop():void {}
    }
}
