/// <reference path="../../../extensions/arrayExtensions.ts" />
/// <reference path="../../components/fieldTypes/select/selectFieldOptionMetadataModel.ts" />

//Base class for mapper services (provides some useful functions)
module Services {
    'use strict';

    export class ObjectMapperBaseService {
        public AutomapProperties(sourceObject:any, destinationObject:any, propertiesArray:string[]):void {
            for (var property in sourceObject) {
                if (sourceObject.hasOwnProperty(property)) {
                    if (sourceObject[property] != null && (propertiesArray == null || propertiesArray.contains(property))) {
                        destinationObject[property] = sourceObject[property];
                    }
                }
            }
        }

        public GetSelectFieldOptionFromStringProperty(sourceObject:any, propertyName:string):Models.SelectFieldOptionMetadata {
            var value:string = sourceObject[propertyName];
            return new Models.SelectFieldOptionMetadata(value, value);
        }

        public GetSelectFieldOptionsFromArrayProperty(sourceObject:any, propertyName:string):Models.SelectFieldOptionMetadata[] {
            var value:string[] = sourceObject[propertyName];
            var result:Models.SelectFieldOptionMetadata[] = [];
            if (!value.length) {
                return result;
            }

            for (var i:number = 0; i < value.length; i++) {
                var itemValue:string = value[i];
                var item:Models.SelectFieldOptionMetadata = new Models.SelectFieldOptionMetadata(itemValue, itemValue);
                result.push(item);
            }
            return result;
        }
    }
}
