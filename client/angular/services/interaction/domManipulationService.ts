/// <reference path="../../interfaces/services/interaction/IDomManipulationService.ts" />

declare var document:Document;

//Service that wraps DOM manipulations
module Services {
    'use strict';

    export class DomManipulationService implements Services.IDomManipulationService {
        //@ngInject
        constructor() {
            //Nothing to do here
        }

        public ScrollToTop():void {
            document.body.scrollTop = 0;
        }
    }
}
