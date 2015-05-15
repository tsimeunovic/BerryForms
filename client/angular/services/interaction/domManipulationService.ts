/// <reference path="../../interfaces/services/interaction/IDomManipulationService.ts" />

declare var document:Document;

//Service that wraps DOM manipulations
module Services {
    'use strict';

    export class DomManipulationService implements Services.IDomManipulationService {
        public static injection():any[] {
            return [
                DomManipulationService
            ];
        }

        public ScrollToTop():void {
            document.body.scrollTop = 0;
        }
    }
}
