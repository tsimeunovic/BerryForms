/// <reference path="./selectFieldMetadataModel.ts" />
/// <reference path="../../../interfaces/components/fieldTypes/IFieldType.ts" />

module Components.FieldTypes {
    'use strict';

    export class SelectFieldFilter {
        public static CreateFilterFields(fieldMetadata:Models.FieldMetadata):Models.FieldMetadata[] {
            var selectFieldMetadata:Models.SelectFieldMetadata = <Models.SelectFieldMetadata> fieldMetadata;
            var resources:Localization.IResources = Services.LocalizationService.Resources;

            var anyOption:Models.SelectFieldOptionMetadata = new Models.SelectFieldOptionMetadata(null, null);
            anyOption.Text = resources.AnyValue;
            var optionsCopy:Models.SelectFieldOptionMetadata[] = selectFieldMetadata.Values.createCopy();
            optionsCopy.unshift(anyOption);

            var filter:Models.SelectFieldMetadata = new Models.SelectFieldMetadata();
            filter.FieldSystemName = selectFieldMetadata.FieldSystemName;
            filter.FieldName = selectFieldMetadata.FieldName;
            filter.Required = false;
            filter.Values = optionsCopy;
            filter.DefaultValue = anyOption;

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
            var routeValue:string = routeParams[fieldMetadata.FieldSystemName];
            if (!routeValue) {
                return;
            }
            filterEntity.Data[fieldMetadata.FieldSystemName] = new Models.SelectFieldOptionMetadata(routeValue, routeValue);
        }

        public static CreateFilterQueryString(fieldMetadata:Models.FieldMetadata, filterValues:any[]):string[] {
            if (!filterValues || filterValues.length !== 1) {
                return null;
            }
            if (!filterValues[0] || !filterValues[0].Value) {
                return null;
            }
            var query:string = fieldMetadata.FieldSystemName + '=' + filterValues[0].Value;
            return [query];
        }
    }
}
