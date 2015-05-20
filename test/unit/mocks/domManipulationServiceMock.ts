/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/services/interaction/IDomManipulationService.ts" />

module Mocks {
    'use strict';

    export class DomManipulationServiceMock implements Services.IDomManipulationService {
        constructor() {
            this.Setup();
        }

        //Mock members
        public ScrollToTop():void {
            //Do nothing
        }

        private Setup():void {
            spyOn(this, 'ScrollToTop').and.callThrough();
        }
    }
}
