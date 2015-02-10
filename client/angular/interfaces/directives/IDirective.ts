'use strict';

//Base interface for every directive
module Directives {
    export interface IDirective {
        Link($scope:any, $linkElement:any, $linkAttributes:any):void;
    }
}
