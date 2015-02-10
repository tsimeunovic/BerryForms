'use strict';

//Extensions of javascript date type
interface Date {
    format(formatString:string):string;
}

Date.prototype.format = function (formatString:string):string {
    var ensure2Digits = function (value:number) {
        var valueStr:string = value.toString();
        if (valueStr.length == 1) return ('0' + valueStr);
        else return valueStr;
    };
    var replacements = [
        ['yyyy', this.getYear() + 1900],
        ['yy', this.getYear() % 100],
        ['MM', this.getMonth() + 1],
        ['dd', this.getDate()],
        ['HH', this.getHours()],
        ['mm', ensure2Digits(this.getMinutes())],
        ['ss', ensure2Digits(this.getSeconds())]
    ];
    var result = formatString;
    for (var i = 0; i < replacements.length; i++) {
        var regExp = new RegExp(replacements[i][0], 'g');
        result = result.replace(regExp, replacements[i][1]);
    }
    return result;
};
