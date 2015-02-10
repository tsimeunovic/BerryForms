/// <reference path="./config.ts" />

'use strict';

//Helper to read some configuration keys in specific bundles
module ConfigHelper {
    export class Client {
        public static GetFieldsConfigurationFor(fieldType:string):any {
            switch (fieldType) {
                case 'Date':
                    return {
                        DatepickerFormat: Config.Client.DatepickerFormat,
                        DatepickerOptions: Config.Client.DatepickerOptions
                    };
                default:
                    return null;
            }
        }
    }
}
