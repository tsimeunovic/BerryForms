//Names of route parameters
module Static {
    'use strict';

    export class RouteParams {
        public static RouteParamSystemPrefix:string = '_';
        public static EntityName:string = RouteParams.RouteParamSystemPrefix + 'entityName';
        public static EntityId:string = RouteParams.RouteParamSystemPrefix + 'entityId';
        public static PageNumber:string = RouteParams.RouteParamSystemPrefix + 'pageNumber';
    }
}
