'use strict';

//Extensions of javascript date type
/* tslint:disable:interface-name */
interface Date {
    format(formatString:string):string;
}

Date.prototype.format = function (formatString:string):string {
    var ensure2Digits:(val:number) => string = function (value:number):string {
        var valueStr:string = value.toString();
        return valueStr.length === 1 ? ('0' + valueStr) : valueStr;
    };

    var replacements:any[] = [
        ['yyyy', this.getYear() + 1900],
        ['yy', this.getYear() % 100],
        ['MM', this.getMonth() + 1],
        ['dd', this.getDate()],
        ['HH', this.getHours()],
        ['mm', ensure2Digits(this.getMinutes())],
        ['ss', ensure2Digits(this.getSeconds())]
    ];

    var result:string = formatString;
    for (var i:number = 0; i < replacements.length; i++) {
        var regExp:RegExp = new RegExp(replacements[i][0], 'g');
        result = result.replace(regExp, replacements[i][1]);
    }
    return result;
};
