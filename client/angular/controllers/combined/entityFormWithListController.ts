/// <reference path="../base/baseController.ts" />

'use strict';

//Controller for screen with entity record creation & edit
module Controllers {
    export class EntityFormWithListController extends BaseController {
        public static injection():any[] {
            return [
                '$scope',
                '$route',
                EntityFormWithListController
            ]
        }

        constructor(Scope:any,
                    private Route:any) {
            super(Scope);

            this.Scope.Metadata = Route.current.data.metadata;
            this.Scope.Create = Route.current.data.create;
        }
    }
}
