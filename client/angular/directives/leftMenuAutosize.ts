/// <reference path="../../config/config.ts" />
/// <reference path="../interfaces/directives/IDirective.ts" />

declare var angular:any;

//Directive responsible for manipulating left (top) menu icons area when available size change
module Directives {
    'use strict';

    export class LeftMenuAutosize implements Directives.IDirective {
        private static Timeout:any;
        private static Window:any;

        private Scope:any;
        private Element:any;
        private Promise:any;

        private WindowDimensions:any;
        private MenuDimensions:any;

        //@ngInject
        public static DirectiveOptions($timeout:any, $window:any):any {
            LeftMenuAutosize.Timeout = $timeout;
            LeftMenuAutosize.Window = $window;
            return {
                restrict: 'A',
                scope: {
                    expandIconSize: '=',
                    iconSize: '=',
                    iconCount: '='
                },
                replace: false,
                link: function ($scope:any, $linkElement:any, $linkAttributes:any):void {
                    var instance:Directives.IDirective = new LeftMenuAutosize();
                    instance.Link($scope, $linkElement, $linkAttributes);
                }
            };
        }

        public Link($scope:any, $linkElement:any, $linkAttributes:any):void {
            this.Scope = $scope;
            this.Element = $linkElement;

            this.SizeChanged();
            $scope.$watch('iconCount', this.SizeChanged.bind(this));
            angular.element(LeftMenuAutosize.Window).on('resize', this.SizeChanged.bind(this));

            this.BindExpandButton();
        }

        private SizeChanged():void {
            LeftMenuAutosize.Timeout.cancel(this.Promise);
            this.Promise = LeftMenuAutosize.Timeout(this.SetIconsVisibility.bind(this), 0, false);
        }

        private MeasureDimensions():void {
            this.WindowDimensions = {
                width: LeftMenuAutosize.Window.innerWidth,
                height: LeftMenuAutosize.Window.innerHeight
            };

            this.MenuDimensions = {
                width: this.Element[0].offsetWidth,
                height: this.Element[0].offsetHeight
            };

            this.MenuDimensions.primaryDimensionSize = Math.max(this.MenuDimensions.width, this.MenuDimensions.height);
            this.MenuDimensions.primaryDimension = this.MenuDimensions.height > this.MenuDimensions.width ? 'height' : 'width';
            this.MenuDimensions.secondaryDimension = this.MenuDimensions.primaryDimension === 'height' ? 'width' : 'height';
        }

        private SetIconsVisibility():void {
            //Collapse menu
            if (this.Element.hasClass('expanded')) {
                this.ExpandCollapseMenu(null, true);
            }

            //Assume that everything can fit
            this.Element.removeClass('collapsed');
            var elementChildren:any[] = this.Element.children();
            angular.forEach(elementChildren, function (item:any, key:number):void {
                angular.element(item).removeClass('collapsed');
            });

            //Measure space
            this.MeasureDimensions();
            var availableSpace:number = this.MenuDimensions.primaryDimensionSize;
            var everythingCanFit:boolean = (this.Scope.iconCount || 0) * this.Scope.iconSize <= availableSpace;

            if (!everythingCanFit) {
                //Enable collapse-expand of panel
                this.Element.addClass('collapsed');

                //Hide records that cannot fit
                var canFitNumber:number = Math.floor((availableSpace - this.Scope.expandIconSize) / this.Scope.iconSize);
                angular.forEach(elementChildren, function (item:any, key:number):void {
                    if (item.className !== 'menuEntityExpand' && key >= canFitNumber) {
                        angular.element(item).addClass('collapsed');
                    }
                });
            }
        }

        private BindExpandButton():void {
            var toggle:any = this.Element[0].querySelector('.menuEntityExpand');
            toggle.onclick = this.ExpandCollapseMenu.bind(this);
            toggle.onblur = this.ExpandCollapseMenu.bind(this);
        }

        private ExpandCollapseMenu(event:any, collapse:boolean):void {
            var _this:LeftMenuAutosize = this;
            var isExpanded:boolean = this.Element.hasClass('expanded');
            var shouldCollapse:boolean = collapse !== null ? collapse : isExpanded;
            if (event.type === 'blur') {
                shouldCollapse = true;
            }

            //Toggle
            if (shouldCollapse) {
                //Collapse
                setTimeout(function ():void {
                    _this.Element.addClass('collapsed');
                    _this.Element.removeClass('expanded');
                    _this.Element.css(_this.MenuDimensions.primaryDimension, '');
                    _this.Element.css(_this.MenuDimensions.secondaryDimension, '');
                    _this.Element.css('max-' + _this.MenuDimensions.secondaryDimension, '');
                }, 200);
            } else {
                //Calculate required size
                var totalCount:number = this.Scope.iconCount + 1;

                var primaryDimensionFitCount:number = Math.floor((this.MenuDimensions.primaryDimensionSize - this.Scope.expandIconSize) / this.Scope.iconSize);
                var requiredSecondaryDimensionFitCount:number = Math.ceil(totalCount / primaryDimensionFitCount);
                var requiredSecondaryDimensionSize:number = Math.min(requiredSecondaryDimensionFitCount * this.Scope.iconSize,
                    this.WindowDimensions[this.MenuDimensions.secondaryDimension] - this.Scope.iconSize);

                var secondaryDimensionRealFitCount:number = Math.floor(requiredSecondaryDimensionSize / this.Scope.iconSize);
                var primaryDimensionReconciledFitCount:number = Math.ceil(totalCount / secondaryDimensionRealFitCount);
                var primaryDimensionReconciledSize:number = Math.min(primaryDimensionReconciledFitCount * this.Scope.iconSize,
                    this.WindowDimensions[this.MenuDimensions.primaryDimension] - this.Scope.iconSize);

                //Expand
                this.Element.removeClass('collapsed');
                this.Element.addClass('expanded');
                this.Element.css(this.MenuDimensions.primaryDimension, primaryDimensionReconciledSize + 'px');
                this.Element.css(this.MenuDimensions.secondaryDimension, requiredSecondaryDimensionSize + 'px');
                this.Element.css('max-' + this.MenuDimensions.secondaryDimension, requiredSecondaryDimensionSize + 'px');
            }
        }
    }
}
