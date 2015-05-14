/// <reference path="../../interfaces/services/system/INamingConventionsService.ts" />
/// <reference path="../../../extensions/stringExtensions.ts" />

//Service that creates system names according to user specified names
module Services {
    'use strict';

    export class NamingConventionsService implements Services.INamingConventionsService {
        public static injection():any[] {
            return [
                NamingConventionsService
            ];
        }

        public GetSystemEntityName(entityName:string):string {
            return entityName.toLowerCase().removeDiacritics().replaceAll(' ', '_');
        }

        public GetSystemFieldName(fieldName:string):string {
            return fieldName.toLowerCase().removeDiacritics().replaceAll(' ', '');
        }
    }
}
