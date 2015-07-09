/// <reference path="../base/baseController.ts" />

//Controller for screen with entity record creation & edit
module Controllers {
    'use strict';

    export class EntityFormWithListController extends BaseController {
        //@ngInject
        constructor($scope:any,
                    private $route:any) {
            super($scope);

            this.Scope.Metadata = $route.current.data.metadata;
            this.Scope.Create = $route.current.data.create;
        }
    }
}
