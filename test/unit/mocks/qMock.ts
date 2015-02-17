'use strict';

module Mocks {
    export class QMock {
        constructor() {
            this.Setup();
        }

        private Setup():void {
            spyOn(this, 'defer').and.callThrough();
        }

        public defer():Mocks.PromiseMock {
            return new Mocks.PromiseMock();
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

        private IsResolved:boolean;
        private IsRejected:boolean;
        private ResultData:any;

        private RegisteredSuccessFn:(args:any)=>void;
        private RegisteredErrorFn:(args:any)=>void;

        private Setup():void {
            spyOn(this, 'reject').and.callThrough();
            spyOn(this, 'resolve').and.callThrough();
            spyOn(this, 'then').and.callThrough();
        }

        public promise:any;

        public resolve(resultData:any):void {
            if(this.IsResolved || this.IsRejected) throw new Error();
            this.IsResolved = true;
            if(this.RegisteredSuccessFn) this.RegisteredSuccessFn(resultData);
            this.ResultData = resultData;
        }

        public reject(resultData:any):void {
            if(this.IsResolved || this.IsRejected) throw new Error();
            this.IsRejected = true;
            if(this.RegisteredErrorFn) this.RegisteredErrorFn(resultData);
            this.ResultData = resultData;
        }

        public then(successFn:(args:any)=>void, errorFn:(args:any)=>void):void {
            this.RegisteredSuccessFn = successFn;
            this.RegisteredErrorFn = errorFn;
            if(this.IsResolved) successFn(this.ResultData);
            if(this.IsRejected) errorFn(this.ResultData);
        }
    }
}