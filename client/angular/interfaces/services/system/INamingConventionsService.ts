'use strict';

//Interface for Naming conventions service (creates system names according to user specified names)
module Services {
    export interface INamingConventionsService {
        GetSystemEntityName(entityName:string):string;
        GetSystemFieldName(fieldName:string):string;
    }
}
