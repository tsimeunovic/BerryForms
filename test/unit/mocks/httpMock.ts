/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/extensions/arrayExtensions.ts" />

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

        public AddResponse(method:string, url:string, responseData:any, statusCode:number) {
            this.Responses.push({
                Method: method,
                Url: url,
                SuccessResponse: statusCode < 400,
                StatusCode: statusCode,
                ResponseData: responseData
            });
        }

        protected ResponseFor(method:string, url:string):any {
            var configuredResponsePredicate = function (response) {
                return response.Method == method && response.Url == url;
            };
            var configuredResponse = this.Responses.single(configuredResponsePredicate);
            if(configuredResponse) this.Responses.remove(configuredResponse);

            var result = {
                success: function (successCallback) {
                    if (configuredResponse && configuredResponse.SuccessResponse)
                        successCallback(configuredResponse.ResponseData, configuredResponse.StatusCode);
                    return result;
                },
                error: function (errorCallback) {
                    if (!configuredResponse || !configuredResponse.SuccessResponse)
                        errorCallback(configuredResponse ? configuredResponse.ResponseData : null, configuredResponse ? configuredResponse.StatusCode : 500);
                    return result;
                },
                then: function(successCallback, errorCallback) {
                    if (configuredResponse && configuredResponse.SuccessResponse)
                        successCallback(configuredResponse.ResponseData, configuredResponse.StatusCode);
                    else if (!configuredResponse || !configuredResponse.SuccessResponse)
                        errorCallback(configuredResponse ? configuredResponse.ResponseData : null, configuredResponse ? configuredResponse.StatusCode : 500);
                    return result;
                }
            };
            return result;
        }

        //Mock members
        public get(url:string, config:any):any {
            return this.ResponseFor('get', url);
        }

        public post(url:string, data:any, config:any):any {
            return this.ResponseFor('post', url);
        }

        public put(url:string, data:any, config:any):any {
            return this.ResponseFor('put', url);
        }

        public delete(url:string, config:any):any {
            return this.ResponseFor('delete', url);
        }
    }
}
