//Application routes
module Config {
    'use strict';

    export class Router {
        //@ngInject
        public static InitializeRoutes($routeProvider:any):void {
            Router.InitializeDashboardRoutes($routeProvider);
            Router.InitializeMetadataRoutes($routeProvider);
            Router.InitializeEntityRoutes($routeProvider);
            Router.InitializeOtherRoutes($routeProvider);
        }

        private static InitializeDashboardRoutes($routeProvider:any):any {
            return $routeProvider
                .when('/dashboard/:_entityName', {
                    templateUrl: 'angular/views/dashboard.html',
                    controller: 'DashboardController'
                })
                .when('/dashboard', {
                    templateUrl: 'angular/views/dashboard.html',
                    controller: 'DashboardController'
                });
        }

        private static InitializeMetadataRoutes($routeProvider:any):any {
            return $routeProvider
                .when('/schema/entity/:_entityName', {
                    templateUrl: 'angular/views/entityFormWithList.html',
                    controller: 'EntityFormWithListController',
                    controllerAs: 'flc',
                    data: {
                        metadata: true,
                        create: false
                    }
                })
                .when('/schema/entity', {
                    templateUrl: 'angular/views/entityFormWithList.html',
                    controller: 'EntityFormWithListController',
                    controllerAs: 'flc',
                    data: {
                        metadata: true,
                        create: true
                    }
                });
        }

        private static InitializeEntityRoutes($routeProvider:any):any {
            return $routeProvider
                .when('/entity/:_entityName/filteredlist/page/:_pageNumber', {
                    templateUrl: 'angular/views/entityListWithFilter.html',
                    controller: 'EntityListWithFilterController',
                    controllerAs: 'lc',
                    data: {
                        metadata: false,
                        create: false
                    }
                })
                .when('/entity/:_entityName/filteredlist', {
                    templateUrl: 'angular/views/entityListWithFilter.html',
                    controller: 'EntityListWithFilterController',
                    controllerAs: 'lc',
                    data: {
                        metadata: false,
                        create: false
                    }
                })
                .when('/entity/:_entityName/page/:_pageNumber/id/:_entityId', {
                    templateUrl: 'angular/views/entityFormWithList.html',
                    controller: 'EntityFormWithListController',
                    controllerAs: 'flc',
                    data: {
                        metadata: false,
                        create: false
                    }
                })
                .when('/entity/:_entityName/page/:_pageNumber', {
                    templateUrl: 'angular/views/entityFormWithList.html',
                    controller: 'EntityFormWithListController',
                    controllerAs: 'flc',
                    data: {
                        metadata: false,
                        create: true
                    }
                })
                .when('/entity/:_entityName/id/:_entityId', {
                    templateUrl: 'angular/views/entityFormWithList.html',
                    controller: 'EntityFormWithListController',
                    controllerAs: 'flc',
                    data: {
                        metadata: false,
                        create: false
                    }
                })
                .when('/entity/:_entityName', {
                    templateUrl: 'angular/views/entityFormWithList.html',
                    controller: 'EntityFormWithListController',
                    controllerAs: 'flc',
                    data: {
                        metadata: false,
                        create: true
                    }
                });
        }

        private static InitializeOtherRoutes($routeProvider:any):void {
            $routeProvider
                //Default
                .otherwise({
                    redirectTo: '/dashboard'
                });
        }
    }
}
