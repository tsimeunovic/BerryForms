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
            var templateUrl:string = 'angular/components/fieldTypes/' + fieldType.toLowerCase() + '/template.html';

            return {
                restrict: 'C',
                scope: '=',
                replace: true,
                templateUrl: templateUrl,
                link: function ($scope:any, $linkElement:any, $linkAttributes:any):void {
                    var instance:Directives.IDirective = directiveConstructor();
                    instance.Link($scope, $linkElement, $linkAttributes);
                }
            };
        }

        //Base implementation
        public Scope:any;

        public Link($scope:any, $linkElement:any, $linkAttributes:any):void {
            this.Scope = $scope;
            this.Scope.Resources = Services.LocalizationService.Resources;
            this.WatchValue($scope);
        }

        public WatchValue($scope:any):void {
            var _this:BaseField = this;
            $scope.$watchGroup(['Entity', 'Entity.Data[field.FieldSystemName]'], function ():void {
                _this.ValueChanged();
            });
        }

        public ValueChanged():void {
            if (!this.Scope.Entity) {
                this.Scope.IsValid = false;
                return;
            }

            var fieldMetadata:Models.FieldMetadata = this.Scope.field;
            var value:any = this.Scope.Entity.Data[fieldMetadata.FieldSystemName];
            var valid:boolean = fieldMetadata.ValidateValue(value);

            if (valid) {
                this.Scope.Entity.ErrorFields.remove(fieldMetadata.FieldSystemName);
            } else {
                this.Scope.Entity.ErrorFields.add(fieldMetadata.FieldSystemName);
            }

            this.Scope.IsValid = valid;
            if (fieldMetadata.ValueChanged) {
                fieldMetadata.ValueChanged(value, valid);
            }
        }
    }
}
