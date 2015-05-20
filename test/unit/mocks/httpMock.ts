/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/extensions/arrayExtensions.ts" />

module Mocks {
    'use strict';

    export class HttpMock {
        constructor() {
            this.Responses = [];
            this.Setup();
        }

        private Responses:any[];

        public AddResponse(method:string, url:string, responseData:any, statusCode:number):void {
            this.Responses.push({
                Method: method,
                Url: url,
                SuccessResponse: statusCode < 400,
                StatusCode: statusCode,
                ResponseData: responseData
            });
        }

        protected ResponseFor(method:string, url:string):any {
            var configuredResponsePredicate:(r:any) => boolean = function (response:any):boolean {
                return response.Method === method && response.Url === url;
            };
            var configuredResponse:any = this.Responses.single(configuredResponsePredicate);
            if (configuredResponse) {
                this.Responses.remove(configuredResponse);
            }

            var result:any = {
                success: function (successCallback:(d:any, c:number) => void):any {
                    if (configuredResponse && configuredResponse.SuccessResponse) {
                        successCallback(configuredResponse.ResponseData, configuredResponse.StatusCode);
                    }
                    return result;
                },
                error: function (errorCallback:(ed:any, ec:number) => void):any {
                    if (!configuredResponse || !configuredResponse.SuccessResponse) {
                        errorCallback(configuredResponse ? configuredResponse.ResponseData : null,
                            configuredResponse ? configuredResponse.StatusCode : 500);
                    }
                    return result;
                },
                then: function (successCallback:(d:any, c:number) => void, errorCallback:(ed:any, ec:number) => void):any {
                    if (configuredResponse && configuredResponse.SuccessResponse) {
                        successCallback(configuredResponse.ResponseData, configuredResponse.StatusCode);
                    } else if (!configuredResponse || !configuredResponse.SuccessResponse) {
                        errorCallback(configuredResponse ? configuredResponse.ResponseData : null, configuredResponse ? configuredResponse.StatusCode : 500);
                    }
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

        private Setup():void {
            spyOn(this, 'get').and.callThrough();
            spyOn(this, 'post').and.callThrough();
            spyOn(this, 'put').and.callThrough();
            spyOn(this, 'delete').and.callThrough();
        }
    }
}
