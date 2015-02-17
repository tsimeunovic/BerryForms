/// <reference path="../../jasmine.d.ts" />

'use strict';

module Mocks {
    export class HttpMock {
        constructor() {
            this.Responses = [];
            this.Setup();
        }

        private Setup():void {
            spyOn(this, 'get').and.callThrough();
            spyOn(this, 'post').and.callThrough();
            spyOn(this, 'put').and.callThrough();
            spyOn(this, 'delete').and.callThrough();
        }

        private Responses:any[];

        public AddResponse(method:string, url:string, successResponse:boolean, responseData:any) {
            this.Responses.push({
                Method: method,
                Url: url,
                SuccessResponse: successResponse,
                ResponseData: responseData
            });
        }

        protected ResponseFor(method:string, url:string):any {
            var configuredResponsePredicate = function (response) {
                return response.Method == method && response.Url == url;
            };
            var configuredResponse = this.Responses.single(configuredResponsePredicate);

            var result = {
                success: function (successCallback) {
                    if (configuredResponse && configuredResponse.SuccessResponse)
                        successCallback(configuredResponse.ResponseData);
                    return result;
                },
                error: function (errorCallback) {
                    if (!configuredResponse || !configuredResponse.SuccessResponse)
                        errorCallback(configuredResponse ? configuredResponse.ResponseData : null);
                    return result;
                },
                then: function(successCallback, errorCallback) {
                    if (configuredResponse && configuredResponse.SuccessResponse)
                        successCallback(configuredResponse.ResponseData);
                    else if (!configuredResponse || !configuredResponse.SuccessResponse)
                        errorCallback(configuredResponse ? configuredResponse.ResponseData : null);
                    return result;
                }
            };
            return result;
        }

        //Mock members
        public get(url:string):any {
            return this.ResponseFor('get', url);
        }

        public post(url:string, data:any):any {
            return this.ResponseFor('post', url);
        }

        public put(url:string, data:any):any {
            return this.ResponseFor('put', url);
        }

        public delete(url:string):any {
            return this.ResponseFor('delete', url);
        }
    }
}
