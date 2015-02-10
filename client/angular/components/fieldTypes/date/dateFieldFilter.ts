/// <reference path="./dateFieldMetadataModel.ts" />
/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../../../extensions/stringExtensions.ts" />

'use strict';

module Components.FieldTypes {
    export class DateFieldFilter {
        public static CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            var dateFieldMetadata:Models.DateFieldMetadata = <Models.DateFieldMetadata> fieldMetadata;
            var resources:Localization.IResources = Services.LocalizationService.Resources;

            var filterFrom:Models.DateFieldMetadata = new Models.DateFieldMetadata();
            filterFrom.FieldSystemName = 'from_' + dateFieldMetadata.FieldSystemName;
            filterFrom.FieldName = resources.DateFrom.format([fieldMetadata.FieldName]);
            filterFrom.Required = false;
            filterFrom.MinDate = dateFieldMetadata.MinDate;
            filterFrom.MaxDate = dateFieldMetadata.MaxDate;

            var filterTo:Models.DateFieldMetadata = new Models.DateFieldMetadata();
            filterTo.FieldSystemName = 'to_' + dateFieldMetadata.FieldSystemName;
            filterTo.FieldName = resources.DateTo.format([fieldMetadata.FieldName]);
            filterTo.Required = false;
            filterTo.MinDate = dateFieldMetadata.MinDate;
            filterTo.MaxDate = dateFieldMetadata.MaxDate;

            return [filterFrom, filterTo];
        }

        public static CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            if (!filterValues || filterValues.length != 2) return null;
            var from = filterValues[0];
            var to = filterValues[1];
            if (!from && !to) return null;

            var filterExpression = {};
            var filterExpressionDateQuery = {};
            if (from) filterExpressionDateQuery['$gte'] = from;
            if (to) filterExpressionDateQuery['$lte'] = to;
            filterExpression['Data.' + fieldMetadata.FieldSystemName] = filterExpressionDateQuery;

            return filterExpression;
        }

        public static ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            var routeValueFrom = routeParams['from_' + fieldMetadata.FieldSystemName];
            if (routeValueFrom) {
                var valueFrom = Date.parse(routeValueFrom);
                filterEntity.Data['from_' + fieldMetadata.FieldSystemName] = valueFrom;
            }

            var routeValueTo = routeParams['to_' + fieldMetadata.FieldSystemName];
            if (routeValueTo) {
                var valueTo = Date.parse(routeValueTo);
                filterEntity.Data['to_' + fieldMetadata.FieldSystemName] = valueTo;
            }
        }

        public static CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            if (!filterValues || filterValues.length != 2) return null;
            var from = filterValues[0];
            var to = filterValues[1];

            var result = [];
            if (from) result.push('from_' + fieldMetadata.FieldSystemName + '=' + DateFieldFilter.StringifyDate(from));
            if (to) result.push('to_' + fieldMetadata.FieldSystemName + '=' + DateFieldFilter.StringifyDate(to));
            return result;
        }

        private static StringifyDate(value:any) {
            var utcDate = new Date(value);
            var timeRegExp = new RegExp('T[\\s\\S]+Z');
            return JSON.parse(JSON.stringify(utcDate).replace(timeRegExp, ''));
        }
    }
}
