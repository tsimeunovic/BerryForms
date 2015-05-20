/// <reference path="../../jasmine.d.ts" />

module Mocks {
    'use strict';

    export class QMock {
        constructor() {
            this.Setup();
        }

        public defer():Mocks.PromiseMock {
            return new Mocks.PromiseMock();
        }

        private Setup():void {
            spyOn(this, 'defer').and.callThrough();
        }
    }

    export class PromiseMock {
        constructor() {
            this.Setup();
            this.promise = this;
            this.IsResolved = false;
            this.IsRejected = false;
            this.ResultData = null;
        }

        public promise:any;

        private IsResolved:boolean;
        private IsRejected:boolean;
        private ResultData:any;

        private RegisteredSuccessFn:(args:any) => void;
        private RegisteredErrorFn:(args:any) => void;

        public resolve(resultData:any):void {
            if (this.IsResolved || this.IsRejected) {
                throw new Error();
            }

            this.IsResolved = true;
            this.ResultData = resultData;

            if (this.RegisteredSuccessFn) {
                this.RegisteredSuccessFn(resultData);
            }
        }

        public reject(resultData:any):void {
            if (this.IsResolved || this.IsRejected) {
                throw new Error();
            }

            this.IsRejected = true;
            this.ResultData = resultData;

            if (this.RegisteredErrorFn) {
                this.RegisteredErrorFn(resultData);
            }
        }

        public then(successFn:(args:any) => void, errorFn:(args:any) => void):void {
            this.RegisteredSuccessFn = successFn;
            this.RegisteredErrorFn = errorFn;

            if (this.IsResolved) {
                successFn(this.ResultData);
            } else if (this.IsRejected) {
                errorFn(this.ResultData);
            }
        }

        private Setup():void {
            spyOn(this, 'reject').and.callThrough();
            spyOn(this, 'resolve').and.callThrough();
            spyOn(this, 'then').and.callThrough();
        }
    }
}
