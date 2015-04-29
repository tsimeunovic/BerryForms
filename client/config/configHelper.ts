/// <reference path="./config.ts" />

//Helper to read some configuration keys in specific bundles
module ConfigHelper {
    'use strict';

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
