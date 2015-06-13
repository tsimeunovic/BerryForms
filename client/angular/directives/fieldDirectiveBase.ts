/// <reference path="../interfaces/directives/IDirective.ts" />
/// <reference path="../models/core/fieldMetadataModel.ts" />
/// <reference path="../services/localization/localizationService.ts" />

//Base directive for all UI components for creating/editing specific type of data
module Directives {
    'use strict';

    export class BaseField implements Directives.IDirective {
        /* tslint:disable:member-ordering */
        //Base static methods
        public static DirectiveOptions(fieldType:string, directiveConstructor:() => Directives.IDirective):any {
            var lowerFieldType:string = fieldType.toLowerCase();
            var templateUrl:string = 'angular/components/fieldTypes/' + lowerFieldType + '/template.html';

            return {
                restrict: 'C',
                scope: '=',
                controller: fieldType + 'FieldController',
                controllerAs: lowerFieldType[0] + 'fc',
                replace: true,
                templateUrl: templateUrl,
                link: function ($scope:any, $linkElement:any, $linkAttributes:any):void {
                    var instance:Directives.IDirective = directiveConstructor();
                    instance.Link($scope, $linkElement, $linkAttributes);
                }
            };
        }

        public Link($scope:any, $linkElement:any, $linkAttributes:any):void {
            //Intentionally left empty
        }
    }
}
