'use strict';

module Helpers {
    export class ValuesRotation {
        public static NumberOfRotations(rotationsObject:any):number {
            var totalRotations = 1;
            for (var prop in rotationsObject) {
                if (rotationsObject.hasOwnProperty(prop))
                    totalRotations *= rotationsObject[prop].length;
            }
            return totalRotations;
        }

        public static GetObjectForRotation(rotationsObject:any, rotationNumber:number):any {
            var result = {};
            for (var prop in rotationsObject) {
                if (rotationsObject.hasOwnProperty(prop)) {
                    var propCount = rotationsObject[prop].length;
                    var propCurrentIndex = rotationNumber % propCount;
                    rotationNumber = Math.round((rotationNumber - propCurrentIndex) / propCount);
                    result[prop] = rotationsObject[prop][propCurrentIndex];
                }
            }
            return result;
        }
    }
}
