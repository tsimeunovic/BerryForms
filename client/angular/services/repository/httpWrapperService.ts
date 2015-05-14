/// <reference path="../../interfaces/services/repository/IHttpWrapperService.ts" />
/// <reference path="../../interfaces/services/state/IStateService.ts" />
/// <reference path="../../models/security/userSessionModel.ts" />
/// <reference path="../../../extensions/stringExtensions.ts" />

//Service that wraps angular $http calls to api. Adds authentication headers and stores unauthenticated requests for later retry
module Services {
    'use strict';

    export class HttpWrapperService implements IHttpWrapperService {
        public static injection():any[] {
            return [
                '$q',
                '$http',
                'StateService',
                HttpWrapperService
            ];
        }

        constructor(private Q:any,
                    private Http:any,
                    private StateService:Services.IStateService) {
        }

        public AnonymousGet(url:string, actionName:string):any {
            return this.DoHttpOperation(false, true, 'GET', url, actionName, null);
        }

        public AnonymousPost(url:string, actionName:string, data:any):any {
            return this.DoHttpOperation(false, true, 'POST', url, actionName, data);
        }

        public Get(url:string, actionName:string):any {
            return this.DoHttpOperation(true, true, 'GET', url, actionName, null);
        }

        public Put(url:string, actionName:string, data:any):any {
            return this.DoHttpOperation(true, false, 'PUT', url, actionName, data);
        }

        public Post(url:string, actionName:string, data:any, isInvariantOperation:boolean = false):any {
            return this.DoHttpOperation(true, isInvariantOperation, 'POST', url, actionName, data);
        }

        public Delete(url:string, actionName:string):any {
            return this.DoHttpOperation(true, false, 'DELETE', url, actionName, null);
        }

        private DoHttpOperation(authenticatedOnly:boolean, isInvariantOperation:boolean, method:string, url:string, actionName:string, data:any):any {
            var deferred:any = this.Q.defer();
            var afterLoginRetryFunction:(df:any, i:boolean, m:string, u:string, a:string, d:any) => void = authenticatedOnly ?
                this.CreateAfterLoginRetryFunctionFor(deferred, isInvariantOperation, method, url, actionName, data) :
                null;

            //Retrieve user
            var userSession:Models.UserSession = this.StateService.GetCurrentUserSession();
            if (!userSession && authenticatedOnly) {
                //Unauthenticated
                this.HandleUnauthenticatedUser(deferred, afterLoginRetryFunction);
            } else {
                //Do request
                var requestConfig:any = this.CreateRequestConfigFor(userSession);
                var hasBodyAs2ndParam:boolean = ['POST', 'PUT'].contains(method);
                var serviceMethod:string = method.toLowerCase();
                var httpPromise:any = this.Http[serviceMethod](url, hasBodyAs2ndParam ? data : requestConfig, hasBodyAs2ndParam ? requestConfig : null);
                this.ChainPromises(deferred, httpPromise, afterLoginRetryFunction);
            }

            //Return promise
            return deferred.promise;
        }

        private CreateRequestConfigFor(userSession:Models.UserSession):any {
            if (!userSession) {
                return {};
            } else {
                return {
                    headers: {
                        'X-BF-Auth-User': userSession.User.UserName,
                        'X-BF-Auth-Valid-To': userSession.ValidTo,
                        'X-BF-Auth-Token': userSession.Token
                    }
                };
            }
        }

        private CreateAfterLoginRetryFunctionFor(originalDeferred:any, isInvariantOperation:boolean, method:string,
                                                 url:string, actionName:string, data:any):any {
            var _this:HttpWrapperService = this;

            //Allow cancellation of any method that modify state
            var canCancel:boolean = !isInvariantOperation;
            var retryFunction:() => void = function ():void {
                var newPromise:any = _this.DoHttpOperation(true, isInvariantOperation, method, url, actionName, data);
                _this.ChainPromises(originalDeferred, newPromise, null);
            };

            var cancelFunction:() => void = function ():void {
                originalDeferred.reject({Type: 'Cancellation'});
            };

            return {
                actionName: actionName,
                canCancel: canCancel,
                retryFunction: retryFunction,
                cancelFunction: canCancel ? cancelFunction : null
            };
        }

        private ChainPromises(originalDeferred:any, newPromise:any, retryFunction:() => void):void {
            var _this:HttpWrapperService = this;
            var successCallback:(d:any, s:number, h:any, c:any) => void = function (data:any, status:number, headers:any, config:any):void {
                originalDeferred.resolve(data);
            };
            var errorCallback:(d:any, s:number, h:any, c:any) => void = function (data:any, status:number, headers:any, config:any):void {
                if (status === 401) {
                    //Unauthenticated
                    _this.HandleUnauthenticatedUser(originalDeferred, retryFunction);
                    return;
                }

                //Reject
                originalDeferred.reject(data);
            };


            if (newPromise.success !== undefined) {
                //Http promise
                newPromise.success(successCallback).error(errorCallback);
            } else {
                //Q promise
                newPromise.then(successCallback, errorCallback);
            }
        }

        private HandleUnauthenticatedUser(deferred:any, afterLoginRetryFunction:any):void {
            //Register retry or reject promise
            if (afterLoginRetryFunction) {
                this.StateService.RegisterPostLoginAction(
                    afterLoginRetryFunction.actionName, afterLoginRetryFunction.canCancel,
                    afterLoginRetryFunction.retryFunction, afterLoginRetryFunction.cancelFunction);
            } else {
                deferred.reject(null, {Type: 'Client', ErrorTypeKey: 'UserUnauthenticated'});
            }

            //Redirect to login
            this.StateService.SetCurrentUserSession(null);
        }
    }
}
