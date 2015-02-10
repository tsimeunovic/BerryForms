'use strict';

//Regular expression
interface RegExp {
    toJSON():string;
}

RegExp.prototype.toJSON = function () {
    return this.source;
};

//Extensions of javascript object type
interface Object {
    isEmpty(object:any):boolean;
    haveEqualData(objA:any, objB:any):boolean;
    copyKeys(source:any, destination:any):void;
    clone(source:any):any;
}

Object.haveEqualData = function (objA:any, objB:any):boolean {
    if (!objA) return !objB;
    else if (!objB) return false;
    else return JSON.stringify(objA) === JSON.stringify(objB);
};

Object.isEmpty = function (object:any):boolean {
    return Object.keys(object).length === 0;
};

Object.copyKeys = function (source:any, destination:any):void {
    if (!source) return;
    for (var key in source) {
        if (source.hasOwnProperty(key)) destination[key] = source[key];
    }
};

Object.clone = function(source:any):any {
    return JSON.parse(JSON.stringify(source));
};
