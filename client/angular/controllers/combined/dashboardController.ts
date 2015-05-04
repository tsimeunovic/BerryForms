/// <reference path="../base/baseController.ts" />

//Controller for screen with dashboard
module Controllers {
    'use strict';

    export class DashboardController extends BaseController {
        public static injection():any[] {
            return [
                '$scope',
                '$route',
                DashboardController
            ];
        }

        constructor(Scope:any,
                    Route:any) {
            super(Scope);
        }
    }
}
