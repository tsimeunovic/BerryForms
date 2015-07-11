/// <reference path="../interfaces/directives/IDirective.ts" />

//Directive that creates form for give metadata and entity
module Directives {
    'use strict';

    export class FormFieldsDirective implements Directives.IDirective {
        //@ngInject
        public static DirectiveOptions():any {
            return {
                restrict: 'E',
                scope: {
                    Entity: '=entity',
                    EntityMetadata: '=metadata',
                    ReadOnly: '=readonly'
                },
                replace: true,
                templateUrl: 'angular/views/formFields.html',
                link: function ($scope:any, $linkElement:any, $linkAttributes:any):void {
                    var instance:any = new FormFieldsDirective();
                    instance.Link($scope, $linkElement, $linkAttributes);
                }
            };
        }

        public Link($scope:any, $linkElement:any, $linkAttributes:any):void {
            //Nothing to do here
        }
    }
}
