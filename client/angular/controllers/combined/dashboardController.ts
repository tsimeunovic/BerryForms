/// <reference path="../base/baseController.ts" />

'use strict';

//Controller for screen with dashboard
module Controllers {
    export class DashboardController extends BaseController {
        public static injection():any[] {
            return [
                '$scope',
                '$route',
                DashboardController
            ]
        }

        constructor(Scope:any,
                    Route:any) {
            super(Scope);
        }
    }
}
