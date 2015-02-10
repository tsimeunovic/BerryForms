/// <reference path="../../interfaces/services/state/ICacheService.ts" />

'use strict';

//Base class for services that caches data
module Services {
    export class CacheBaseService<T> implements ICacheService<T> {
        public Data:T;
        public IsLoading:boolean;

        constructor() {
            this.IsLoading = false;
        }

        public InvalidateCache():void {
            //Abstract
            throw new Error();
        }

        public LoadData(argument:any):void {
            //Abstract
            throw new Error();
        }

        public LoadDataCompleted(data:T, errorsModel:any):void {
            //Abstract
            throw new Error();
        }
    }
}
