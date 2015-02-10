/// <reference path="./booleanFieldMetadataModel.ts" />
/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />

'use strict';

module Components.FieldTypes {
    export class BooleanFieldFilter {
        public static CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            var booleanFieldMetadata:Models.BooleanFieldMetadata = <Models.BooleanFieldMetadata> fieldMetadata;

            var filter:Models.BooleanFieldMetadata = new Models.BooleanFieldMetadata();
            filter.FieldSystemName = booleanFieldMetadata.FieldSystemName;
            filter.FieldName = booleanFieldMetadata.FieldName;
            filter.ThreeState = true;
            filter.Required = false;

            return [filter];
        }

        public static CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            if (!filterValues || filterValues.length != 1 || (filterValues[0] === null || filterValues[0] === undefined)) return null;
            var filterExpression = {};
            filterExpression['Data.' + fieldMetadata.FieldSystemName] = filterValues[0];
            return filterExpression;
        }

        public static ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            var routeValue = routeParams[fieldMetadata.FieldSystemName];
            if (routeValue == 'true') filterEntity.Data[fieldMetadata.FieldSystemName] = true;
            else if (routeValue == 'false') filterEntity.Data[fieldMetadata.FieldSystemName] = false;
        }

        public static CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            if (!filterValues || filterValues.length != 1 || (filterValues[0] === null || filterValues[0] === undefined)) return null;
            var query = fieldMetadata.FieldSystemName + '=' + filterValues[0].toString();
            return [query];
        }
    }
}
