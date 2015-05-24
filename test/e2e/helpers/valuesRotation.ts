module Helpers {
    'use strict';

    export class ValuesRotation {
        public static NumberOfRotations(rotationsObject:any):number {
            var totalRotations:number = 1;
            for (var prop in rotationsObject) {
                if (rotationsObject.hasOwnProperty(prop)) {
                    totalRotations *= rotationsObject[prop].length;
                }
            }
            return totalRotations;
        }

        public static GetObjectForRotation(rotationsObject:any, rotationNumber:number):any {
            var result:any = {};
            for (var prop in rotationsObject) {
                if (rotationsObject.hasOwnProperty(prop)) {
                    var propCount:number = rotationsObject[prop].length;
                    var propCurrentIndex:number = rotationNumber % propCount;
                    rotationNumber = Math.round((rotationNumber - propCurrentIndex) / propCount);
                    result[prop] = rotationsObject[prop][propCurrentIndex];
                }
            }
            return result;
        }
    }
}
