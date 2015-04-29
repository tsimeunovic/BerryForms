'use strict';

//Extensions of javascript array type
/* tslint:disable:interface-name */
interface Array<T> {
    add: (item:T) => boolean;
    remove: (item:T) => boolean;
    replace: (old_item:T, new_item:T) => boolean;
    contains: (item:T) => boolean;
    createCopy: () => Array<T>;
    where: (predicate:(item:T) => boolean) => T[];
    single: (predicate:(item:T) => boolean) => T;
    first: (predicate:(item:T) => boolean) => T;
    move: (old_index:number, new_index:number) => void;
}

Array.prototype.add = function (item:any):boolean {
    if (this.indexOf(item) === -1) {
        this.push(item);
        return true;
    }
    return false;
};

Array.prototype.replace = function (old_item:any, new_item:any):boolean {
    var index:number = this.indexOf(old_item);
    if (index > -1) {
        this.splice(index, 1);
        this.splice(index, 0, new_item);
        return true;
    }
    return false;
};

Array.prototype.remove = function (item:any):boolean {
    var index:number = this.indexOf(item);
    if (index > -1) {
        this.splice(index, 1);
        return true;
    }
    return false;
};

Array.prototype.contains = function (item:any):boolean {
    var index:number = this.indexOf(item);
    return index > -1;
};

Array.prototype.createCopy = function ():any[] {
    if (!this) {
        return null;
    }
    var result:any[] = [];
    for (var i:number = 0; i < this.length; i++) {
        result.push(this[i]);
    }
    return result;
};

Array.prototype.where = function (predicate:(item:any) => boolean):any[] {
    if (!this || !this.length) {
        return this;
    }

    var results:any[] = [];
    for (var i:number = 0; i < this.length; i++) {
        if (predicate(this[i])) {
            results.push(this[i]);
        }
    }
    return results;
};

Array.prototype.single = function (predicate:(item:any) => boolean):any {
    var results:any[] = this.where(predicate);
    return results.length === 1 ? results[0] : null;
};

Array.prototype.first = function (predicate:(item:any) => boolean):any {
    if (!this || !this.length) {
        return this;
    }

    for (var i:number = 0; i < this.length; i++) {
        if (predicate(this[i])) {
            return this[i];
        }
    }
    return null;
};

Array.prototype.move = function (old_index:number, new_index:number):void {
    if (new_index >= this.length) {
        var k:number = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
};
