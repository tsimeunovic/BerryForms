'use strict';

//Interface for Http wrapper service.
module Services {
    export interface IHttpWrapperService {
        //Anonymous operations
        AnonymousGet(url:string, actionName:string):any;
        AnonymousPost(url:string, actionName:string, data:any):any;

        //Http operations that required authenticated user
        Get(url:string, actionName:string):any;
        Put(url:string, actionName:string, data:any):any;
        Post(url:string, actionName:string, data:any):any;
        Delete(url:string, actionName:string):any;
    }
}