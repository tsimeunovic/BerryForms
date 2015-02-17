'use strict';

//Service that wraps angular $http calls to api. Adds authentication headers and stores unauthenticated requests for later retry
module Services {
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
            var afterLoginRetryFunction = authenticatedOnly ?
                this.CreateAfterLoginRetryFunctionFor(deferred, isInvariantOperation, method, url, actionName, data) :
                null;

            //Retrieve user
            var userSession:Models.UserSession = this.StateService.GetCurrentUserSession();
            if (!userSession && authenticatedOnly) {
                //Unauthenticated
                this.HandleUnauthenticatedUser(deferred, afterLoginRetryFunction);
            }
            else {
                //Do request
                var request:any = this.RequestFor(userSession, method, url, data);
                var httpPromise = this.Http(request);
                this.ChainPromises(deferred, httpPromise, afterLoginRetryFunction);
            }

            //Return promise
            return deferred.promise;
        }

        private RequestFor(userSession:Models.UserSession, method:string, url:string, data:any):any {
            var request = {
                method: method,
                url: url,
                data: data,
                headers: {}
            };

            if (userSession) {
                //Add session data headers
                request.headers = {
                    'X-BF-Auth-User': userSession.User.UserName,
                    'X-BF-Auth-Valid-To': userSession.ValidTo,
                    'X-BF-Auth-Token': userSession.Token
                }
            }
            return request;
        }

        private CreateAfterLoginRetryFunctionFor(originalDeferred:any, isInvariantOperation:boolean, method:string, url:string, actionName:string, data:any):any {
            var _this = this;

            //Allow cancellation of any method that modify state
            var canCancel:boolean = !isInvariantOperation;
            var retryFunction = function () {
                var newPromise = _this.DoHttpOperation(true, isInvariantOperation, method, url, actionName, data);
                _this.ChainPromises(originalDeferred, newPromise, null);
            };

            var cancelFunction = function () {
                originalDeferred.reject({Type: 'Cancellation'});
            };

            return {
                actionName: actionName,
                canCancel: canCancel,
                retryFunction: retryFunction,
                cancelFunction: canCancel ? cancelFunction : null
            }
        }

        private ChainPromises(originalDeferred:any, newPromise:any, retryFunction:()=>void):void {
            var _this = this;
            var successCallback = function (data, status, headers, config) {
                originalDeferred.resolve(data);
            };
            var errorCallback = function (data, status, headers, config) {
                if (status === 401) {
                    //Unauthenticated
                    _this.HandleUnauthenticatedUser(originalDeferred, retryFunction);
                    return;
                }

                //Reject
                originalDeferred.reject(data);
            };

            //Http promise
            if (newPromise.success !== undefined) newPromise.success(successCallback).error(errorCallback);
            //Q promise
            else newPromise.then(successCallback, errorCallback);
        }

        private HandleUnauthenticatedUser(deferred:any, afterLoginRetryFunction:any):void {
            //Register retry or reject promise
            if (afterLoginRetryFunction) this.StateService.RegisterPostLoginAction(afterLoginRetryFunction.actionName, afterLoginRetryFunction.canCancel, afterLoginRetryFunction.retryFunction, afterLoginRetryFunction.cancelFunction);
            else deferred.reject(null, {Type: 'Client', ErrorTypeKey: 'UserUnauthenticated'});

            //Redirect to login
            this.StateService.SetCurrentUserSession(null);
        }
    }
}