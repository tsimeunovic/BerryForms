/// <reference path="./listFieldMetadataModel.ts" />
/// <reference path="../text/textFieldMetadataModel.ts" />
/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />

'use strict';

module Components.FieldTypes {
    export class ListFieldFilter {
        public static CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            var listFieldMetadata:Models.ListFieldMetadata = <Models.ListFieldMetadata> fieldMetadata;

            var filter:Models.TextFieldMetadata = new Models.TextFieldMetadata();
            filter.FieldSystemName = listFieldMetadata.FieldSystemName;
            filter.FieldName = listFieldMetadata.FieldName;
            filter.Required = false;
            filter.MaxLength = listFieldMetadata.MaxRecordLength;

            return [filter];
        }

        public static CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            if (!filterValues || filterValues.length != 1) return null;
            var value = filterValues[0];
            if (!value) return null;
            var filterExpression = {};
            filterExpression['Data.' + fieldMetadata.FieldSystemName] = value;
            return filterExpression;
        }

        public static ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            var routeValue = routeParams[fieldMetadata.FieldSystemName];
            if (!routeValue) return;
            filterEntity.Data[fieldMetadata.FieldSystemName] = routeValue;
        }

        public static CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            if (!filterValues || filterValues.length != 1) return null;
            if (!filterValues[0]) return null;
            var query = fieldMetadata.FieldSystemName + '=' + filterValues[0];
            return [query];
        }
    }
}
