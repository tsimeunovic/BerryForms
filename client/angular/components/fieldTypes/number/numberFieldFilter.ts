/// <reference path="./numberFieldMetadataModel.ts" />
/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../../../extensions/stringExtensions.ts" />

'use strict';

module Components.FieldTypes {
    export class NumberFieldFilter {
        public static CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            var numberFieldMetadata:Models.NumberFieldMetadata = <Models.NumberFieldMetadata> fieldMetadata;
            var resources:Localization.IResources = Services.LocalizationService.Resources;

            var filterFrom:Models.NumberFieldMetadata = new Models.NumberFieldMetadata();
            filterFrom.FieldSystemName = 'from_' + numberFieldMetadata.FieldSystemName;
            filterFrom.FieldName = resources.NumberFrom.format([fieldMetadata.FieldName]);
            filterFrom.Required = false;
            filterFrom.MinValue = numberFieldMetadata.MinValue;
            filterFrom.MaxValue = numberFieldMetadata.MaxValue;

            var filterTo:Models.NumberFieldMetadata = new Models.NumberFieldMetadata();
            filterTo.FieldSystemName = 'to_' + numberFieldMetadata.FieldSystemName;
            filterTo.FieldName = resources.NumberTo.format([fieldMetadata.FieldName]);
            filterTo.Required = false;
            filterTo.MinValue = numberFieldMetadata.MinValue;
            filterTo.MaxValue = numberFieldMetadata.MaxValue;

            return [filterFrom, filterTo];
        }

        public static CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            if (!filterValues || filterValues.length !== 2) {
                return null;
            }
            var from:number = filterValues[0];
            var to:number = filterValues[1];
            if (!from && !to) {
                return null;
            }

            var filterExpression:any = {};
            var filterExpressionNumberQuery:any = {};
            if (from) {
                filterExpressionNumberQuery.$gte = from;
            }
            if (to) {
                filterExpressionNumberQuery.$lte = to;
            }
            filterExpression['Data.' + fieldMetadata.FieldSystemName] = filterExpressionNumberQuery;

            return filterExpression;
        }

        public static ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            var routeValueFrom:string = routeParams['from_' + fieldMetadata.FieldSystemName];
            if (routeValueFrom) {
                var valueFrom:number = parseFloat(routeValueFrom);
                filterEntity.Data['from_' + fieldMetadata.FieldSystemName] = valueFrom;
            }

            var routeValueTo:string = routeParams['to_' + fieldMetadata.FieldSystemName];
            if (routeValueTo) {
                var valueTo:number = parseFloat(routeValueTo);
                filterEntity.Data['to_' + fieldMetadata.FieldSystemName] = valueTo;
            }
        }

        public static CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            if (!filterValues || filterValues.length !== 2) {
                return null;
            }
            var from:number = filterValues[0];
            var to:number = filterValues[1];

            var result:string[] = [];
            if (from) {
                result.push('from_' + fieldMetadata.FieldSystemName + '=' + from);
            }
            if (to) {
                result.push('to_' + fieldMetadata.FieldSystemName + '=' + to);
            }
            return result;
        }
    }
}
