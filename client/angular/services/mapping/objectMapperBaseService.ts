'use strict';

//Base class for mapper services (provides some useful functions)
module Services {
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

        public GetIntegerFromStringProperty(sourceObject:any, propertyName:string):number {
            var value = sourceObject[propertyName];
            if (!value) return null;
            else return parseInt(value);
        }

        public GetSelectFieldOptionFromStringProperty(sourceObject:any, propertyName:string):Models.SelectFieldOptionMetadata {
            var value = sourceObject[propertyName];
            return new Models.SelectFieldOptionMetadata(value, value);
        }

        public GetSelectFieldOptionsFromArrayProperty(sourceObject:any, propertyName:string):Models.SelectFieldOptionMetadata[] {
            var value = sourceObject[propertyName];
            var result = [];
            if (!value.length) return result;

            for (var i = 0; i < value.length; i++) {
                var itemValue = value[i];
                var item = new Models.SelectFieldOptionMetadata(itemValue, itemValue);
                result.push(item);
            }
            return result;
        }
    }
}
