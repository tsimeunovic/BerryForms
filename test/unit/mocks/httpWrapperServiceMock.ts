/// <reference path="../../../client/angular/interfaces/services/repository/IHttpWrapperService.ts" />
/// <reference path="../../jasmine.d.ts" />
/// <reference path="../mocks/httpMock.ts" />

module Mocks {
    'use strict';

    export class HttpWrapperServiceMock extends HttpMock implements Services.IHttpWrapperService {
        constructor() {
            super();
            this.SetupInherited();
        }

        public AnonymousGet(url:string, actionName:string):any {
            return this.ResponseFor('get', url);
        }

        public AnonymousPost(url:string, actionName:string, data:any):any {
            return this.ResponseFor('post', url);
        }

        public Get(url:string, actionName:string):any {
            return this.ResponseFor('get', url);
        }

        public Put(url:string, actionName:string, data:any):any {
            return this.ResponseFor('put', url);
        }

        public Post(url:string, actionName:string, data:any, isInvariantOperation:boolean):any {
            return this.ResponseFor('post', url);
        }

        public Delete(url:string, actionName:string):any {
            return this.ResponseFor('delete', url);
        }

        private SetupInherited():void {
            spyOn(this, 'AnonymousGet').and.callThrough();
            spyOn(this, 'AnonymousPost').and.callThrough();
            spyOn(this, 'Get').and.callThrough();
            spyOn(this, 'Post').and.callThrough();
            spyOn(this, 'Put').and.callThrough();
            spyOn(this, 'Delete').and.callThrough();
        }
    }
}
