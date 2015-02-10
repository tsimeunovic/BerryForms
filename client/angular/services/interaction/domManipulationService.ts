/// <reference path="../../interfaces/services/interaction/IDomManipulationService.ts" />

'use strict';
declare var document:Document;

//Service that wraps DOM manipulations
module Services {
    export class DomManipulationService implements Services.IDomManipulationService {
        public static injection():any[] {
            return [
                DomManipulationService
            ];
        }

        constructor() {
        }

        public ScrollToTop():void {
            document.body.scrollTop = 0;
        }
    }
}
