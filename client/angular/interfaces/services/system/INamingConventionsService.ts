//Interface for Naming conventions service (creates system names according to user specified names)
module Services {
    'use strict';

    export interface INamingConventionsService {
        GetSystemEntityName(entityName:string):string;
        GetSystemFieldName(fieldName:string):string;
    }
}
