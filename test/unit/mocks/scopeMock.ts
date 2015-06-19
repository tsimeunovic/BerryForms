/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/extensions/arrayExtensions.ts" />

module Mocks {
    'use strict';

    export class ScopeMock {
        constructor() {
            this.Setup();
        }

        private Watchers:any[];

        //Mock members
        public $apply(applyFunc:() => void):void {
            //Do nothing
        }

        public $on(eventName:string, onFunction:() => void):void {
            //Do nothing
        }

        public $watch(expression:string, callback:() => void):void {
            //Do nothing
            this.Watchers.push({
                Expression: expression,
                Callback: callback
            });
        }

        public ExecuteWatcher(expression:string):any {
            var watcherPredicate:(w:any) => boolean = function (w:any):boolean {
                return w.Expression === expression;
            };

            var registeredWatcher:any = this.Watchers.single(watcherPredicate);
            if (registeredWatcher && registeredWatcher.Callback) {
                registeredWatcher.Callback();
            }
        }

        private Setup():void {
            this.Watchers = [];

            spyOn(this, '$apply').and.callThrough();
            spyOn(this, '$on').and.callThrough();
            spyOn(this, '$watch').and.callThrough();
        }
    }

    export class RootScopeMock extends ScopeMock {
    }
}
