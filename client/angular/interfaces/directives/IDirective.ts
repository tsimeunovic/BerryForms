//Base interface for every directive
module Directives {
    'use strict';

    export interface IDirective {
        Link($scope:any, $linkElement:any, $linkAttributes:any):void;
    }
}
