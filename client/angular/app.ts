/// <reference path="./directives/leftMenuAutosize.ts" />
/// <reference path="./directives/systemSymbolDirective.ts" />
/// <reference path="./directives/fieldComponentCreator.ts" />
/// <reference path="./directives/dashboardActivityItemChart.ts" />
/// <reference path="./controllers/global/menuController.ts" />
/// <reference path="./controllers/global/loadingController.ts" />
/// <reference path="./controllers/global/dialogController.ts" />
/// <reference path="./controllers/global/notificationController.ts" />
/// <reference path="./controllers/login/loginController.ts" />
/// <reference path="./controllers/combined/entityFormWithListController.ts" />
/// <reference path="./controllers/form/entityFormController.ts" />
/// <reference path="./controllers/form/entityMetadataFormController.ts" />
/// <reference path="./controllers/form/fieldMetadataFormController.ts" />
/// <reference path="./controllers/list/entityListController.ts" />
/// <reference path="./controllers/list/entityListWithFilterController.ts" />
/// <reference path="./controllers/list/fieldMetadataListController.ts" />
/// <reference path="./controllers/combined/dashboardController.ts" />
/// <reference path="./controllers/dashboard/dashboardActivitySummaryController.ts" />
/// <reference path="./controllers/dashboard/dashboardActivityListController.ts" />
/// <reference path="./interceptors/exceptionHandler.ts" />
/// <reference path="./services/communication/messagingService.ts" />
/// <reference path="./services/communication/queueService.ts" />
/// <reference path="./services/system/namingConventionsService.ts" />
/// <reference path="./services/mapping/entityModelMapperService.ts" />
/// <reference path="./services/mapping/filterConverterService.ts" />
/// <reference path="./services/system/redirectService.ts" />
/// <reference path="./services/localization/localizationService.ts" />
/// <reference path="./services/repository/httpWrapperService.ts" />
/// <reference path="./services/repository/entityRepositoryService.ts" />
/// <reference path="./services/repository/userRepositoryService.ts" />
/// <reference path="./services/repository/dashboardRepositoryService.ts" />
/// <reference path="./services/repository/urlLocatorService.ts" />
/// <reference path="./services/interaction/notificationService.ts" />
/// <reference path="./services/state/entityMetadataListCacheService.ts" />
/// <reference path="./services/state/entityListCacheService.ts" />
/// <reference path="./services/state/stateService.ts" />
/// <reference path="./services/state/persistentStorageService.ts" />
/// <reference path="./services/interaction/dialogService.ts" />
/// <reference path="./services/interaction/domManipulationService.ts" />
/// <reference path="./services/repository/queryCreatorService.ts" />
/// <reference path="./services/plugins/pluginsExecutorService.ts" />
/// <reference path="./services/security/permissionService.ts" />
/// <reference path="./components/fieldTypes/fieldTypesRegistry.ts" />
/// <reference path="./components/fieldTypes/boolean/booleanFieldComponent.ts" />
/// <reference path="./router.ts" />
/// <reference path="./helpers/resourceLoader.ts" />

var _global:any = this;
_global.BootstrapScripts = _global.BootstrapScripts || [];
declare var angular:any;

//Application entry point. Load all required resources, then registers module and its dependencies
module AngularApplication {
    'use strict';

    class Bootstrap {
        public static Start():void {
            var app:any = angular.module('BerryFormsApp', ['ngRoute', 'ui.bootstrap.datepicker', 'ui.sortable', 'toaster']);
            //Routing & Configuration
            app.config(Config.Router.InitializeRoutes);

            //Interceptors
            app.factory('$exceptionHandler', Interceptors.ExceptionHandler.FactoryRegistration);

            //Directives
            app.directive('leftMenuAutosize', Directives.LeftMenuAutosize.DirectiveOptions);
            app.directive('systemSymbol', Directives.SystemSymbol.DirectiveOptions);
            app.directive('fieldComponentCreator', Directives.FieldComponentCreator.DirectiveOptions);
            app.directive('dashboardActivityItemChart', Directives.DashboardActivityItemChart.DirectiveOptions);

            //Services
            app.service('MessagingService', Services.MessagingService);
            app.service('QueueService', Services.QueueService);
            app.service('NamingConventionsService', Services.NamingConventionsService);
            app.service('EntityModelMapperService', Services.EntityModelMapperService);
            app.service('FilterConverterService', Services.FilterConverterService);
            app.service('RedirectService', Services.RedirectService);
            app.service('LocalizationService', Services.LocalizationService);
            app.service('HttpWrapperService', Services.HttpWrapperService);
            app.service('EntityRepositoryService', Services.EntityRepositoryService);
            app.service('UserRepositoryService', Services.UserRepositoryService);
            app.service('DashboardRepositoryService', Services.DashboardRepositoryService);
            app.service('UrlLocatorService', Services.UrlLocatorService);
            app.service('NotificationService', Services.NotificationService);
            app.service('EntityMetadataListCacheService', Services.EntityMetadataListCacheService);
            app.service('EntityListCacheService', Services.EntityListCacheService);
            app.service('PersistentStorageService', Services.PersistentStorageService);
            app.service('StateService', Services.StateService);
            app.service('DialogService', Services.DialogService);
            app.service('DomManipulationService', Services.DomManipulationService);
            app.service('QueryCreatorService', Services.QueryCreatorService);
            app.service('PluginsExecutorService', Services.PluginsExecutorService);
            app.service('PermissionService', Services.PermissionService);

            //Controllers
            app.controller('MenuController', Controllers.MenuController);
            app.controller('LoginController', Controllers.LoginController);
            app.controller('LoadingController', Controllers.LoadingController);
            app.controller('DialogController', Controllers.DialogController);
            app.controller('NotificationController', Controllers.NotificationController);
            app.controller('EntityFormWithListController', Controllers.EntityFormWithListController);
            app.controller('EntityFormController', Controllers.EntityFormController);
            app.controller('EntityMetadataFormController', Controllers.EntityMetadataFormController);
            app.controller('FieldMetadataFormController', Controllers.FieldMetadataFormController);
            app.controller('EntityListController', Controllers.EntityListController);
            app.controller('EntityListWithFilterController', Controllers.EntityListWithFilterController);
            app.controller('FieldMetadataListController', Controllers.FieldMetadataListController);
            app.controller('DashboardController', Controllers.DashboardController);
            app.controller('DashboardActivitySummaryController', Controllers.DashboardActivitySummaryController);
            app.controller('DashboardActivityListController', Controllers.DashboardActivityListController);

            //Components
            app.service('FieldTypesRegistry', Components.FieldTypes.FieldTypesRegistry);
            angular.forEach(_global.Components.FieldTypes, function (value:Components.FieldTypes.IFieldType):void {
                //Register each field type as directive
                app.directive(value.DirectiveName, value.DirectiveOptions());
                app.controller(value.DirectiveControllerName, value.DirectiveControllerOptions());
            });

            //Additional bootstrap scripts
            for (var i:number = 0; i < _global.BootstrapScripts.length; i++) {
                var bootstrapScript:(ng:any) => void = _global.BootstrapScripts[i];
                bootstrapScript(angular);
            }

            //Manual bootstrap
            angular.bootstrap(document, ['BerryFormsApp']);
            document.body.className += ' ng-app';
        }
    }

    //Load resources and start
    (function ():void {
        Helpers.ResourceLoader.LoadRemainingResources(Bootstrap.Start);
    })();
}
