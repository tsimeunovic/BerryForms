/// <reference path="../interfaces/directives/IDirective.ts" />
/// <reference path="../interfaces/components/fieldTypes/IFieldTypesRegistry.ts" />
/// <reference path="../../extensions/stringExtensions.ts" />

//Directive that creates UI component for creating/editing specific type of data based on their 'FieldType'
module Directives {
    'use strict';

    export class FieldComponentCreator implements Directives.IDirective {
        /* tslint:disable:member-ordering */
        public static injection():any[] {
            return [
                '$compile',
                'FieldTypesRegistry',
                FieldComponentCreator.DirectiveOptions
            ];
        }

        private static Compile:any;
        private static FieldTypesRegistry:Components.FieldTypes.IFieldTypesRegistry;

        public static DirectiveOptions($compile:any,
                                       fieldTypesRegistry:Components.FieldTypes.IFieldTypesRegistry):any {
            FieldComponentCreator.Compile = $compile;
            FieldComponentCreator.FieldTypesRegistry = fieldTypesRegistry;

            return {
                restrict: 'A',
                scope: '=',
                replace: false,
                link: function ($scope:any, $linkElement:any, $linkAttributes:any):void {
                    var instance:any = new FieldComponentCreator();
                    instance.Link($scope, $linkElement, $linkAttributes);
                }
            };
        }

        private Scope:any;
        private Element:any;

        public Link($scope:any, $linkElement:any, $linkAttributes:any):void {
            this.Scope = $scope;
            this.Element = $linkElement;

            //Retrieve component type
            var fieldTypeComponent:Components.FieldTypes.IFieldType =
                FieldComponentCreator.FieldTypesRegistry.GetFieldType(this.Scope.field.FieldTypeName, true);

            //Create template
            if ($linkAttributes.readonly) {
                var fieldValue:any = this.Scope.listItem.Data[this.Scope.field.FieldSystemName];
                var formattedValue:string = fieldTypeComponent.FormatValue(fieldValue);
                this.Element.html(formattedValue);
            } else {
                var template:string = '<span class=\'fieldComponent {0}\' data-id=\'{1}\'></span>';
                var directiveName:string = fieldTypeComponent.DirectiveName;
                var fieldSystemName:string = this.Scope.field.FieldSystemName;
                var formattedTemplate:string = template.format([directiveName, fieldSystemName]);
                this.Element.html(formattedTemplate);
                FieldComponentCreator.Compile(this.Element.contents())(this.Scope);
            }
        }
    }
}
