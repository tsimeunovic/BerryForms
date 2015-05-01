/// <reference path="./relationFieldMetadataModel.ts" />
/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />

module Components.FieldTypes {
    'use strict';

    export class RelationFieldFilter {
        public static CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            var relationFieldMetadata:Models.RelationFieldMetadata = <Models.RelationFieldMetadata> fieldMetadata;

            var filter:Models.RelationFieldMetadata = new Models.RelationFieldMetadata();
            filter.FieldSystemName = relationFieldMetadata.FieldSystemName;
            filter.FieldName = relationFieldMetadata.FieldName;
            filter.Required = false;
            filter.RelatedEntity = relationFieldMetadata.RelatedEntity;

            return [filter];
        }

        public static CreateFilterQuery(fieldMetadata:Models.FieldMetadata, filterValues:any[]):any {
            if (!filterValues || filterValues.length !== 1) {
                return null;
            }
            var value:Models.SelectFieldOptionMetadata = filterValues[0];
            if (!value) {
                return null;
            }
            var filterExpression:any = {};
            filterExpression['Data.' + fieldMetadata.FieldSystemName + '.Value'] = value.Value;
            return filterExpression;
        }

        public static ParseFilterQueryString(fieldMetadata:Models.FieldMetadata, filterEntity:Models.Entity, routeParams:any):void {
            var routeValue:string = routeParams[fieldMetadata.FieldSystemName + '_val'];
            var routeText:string = routeParams[fieldMetadata.FieldSystemName + '_txt'];
            if (routeValue) {
                filterEntity.Data[fieldMetadata.FieldSystemName] = new Models.SelectFieldOptionMetadata(routeText, routeValue);
            }
        }

        public static CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            if (!filterValues || filterValues.length !== 1) {
                return null;
            }
            if (!filterValues[0] || !filterValues[0].Value) {
                return null;
            }
            var queryVal:string = fieldMetadata.FieldSystemName + '_val' + '=' + filterValues[0].Value;
            var queryText:string = fieldMetadata.FieldSystemName + '_txt' + '=' + filterValues[0].Text;
            return [queryVal, queryText];
        }
    }
}
