'use strict';

//Extensions of javascript array type
interface Array<T> {
    add: (item) => boolean;
    remove: (item) => boolean;
    replace: (old_item, new_item) => boolean;
    contains: (item) => boolean;
    createCopy: () => any[];
    where: (predicate:any) => any[];
    single: (predicate:any) => any;
    first: (predicate:any) => any;
    move: (old_index:number, new_index:number) => void;
}

Array.prototype.add = function (item):boolean {
    if (this.indexOf(item) == -1) {
        this.push(item);
        return true;
    }
    return false;
};

Array.prototype.replace = function (old_item, new_item):boolean {
    var index = this.indexOf(old_item);
    if (index > -1) {
        this.splice(index, 1);
        this.splice(index, 0, new_item);
        return true;
    }
    return false;
};

Array.prototype.remove = function (item):boolean {
    var index = this.indexOf(item);
    if (index > -1) {
        this.splice(index, 1);
        return true;
    }
    return false;
};

Array.prototype.contains = function (item):boolean {
    var index = this.indexOf(item);
    return index > -1;
};

Array.prototype.createCopy = function ():any[] {
    if (!this) return null;
    var result = [];
    for (var i = 0; i < this.length; i++) {
        result.push(this[i]);
    }
    return result;
};

Array.prototype.where = function (predicate):any[] {
    if (!this || !this.length) return this;

    var results = [];
    if (this.length) {
        for (var i = 0; i < this.length; i++) {
            if (predicate(this[i])) results.push(this[i]);
        }
    }
    else {
        for (var j in this) {
            if (predicate(this[j])) results.push(this[j]);
        }
    }
    return results;
};

Array.prototype.single = function (predicate) {
    var results = this.where(predicate);
    if (results.length == 1) return results[0];
    else return null;
};

Array.prototype.first = function (predicate) {
    if (!this || !this.length) return this;

    if (this.length) {
        for (var i = 0; i < this.length; i++) {
            if (predicate(this[i])) return this[i];
        }
    }
    else {
        for (var j in this) {
            if (predicate(this[j])) return this[j];
        }
    }

    return null;
};

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
};
