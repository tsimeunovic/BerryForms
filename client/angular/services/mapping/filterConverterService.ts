/// <reference path="../../interfaces/services/mapping/IFilterConverterService.ts" />
/// <reference path="../../interfaces/components/fieldTypes/IFieldType.ts" />
/// <reference path="../../../extensions/objectExtensions.ts" />

'use strict';

//Service that creates filter query string and database query object
module Services {
    export class FilterConverterService implements IFilterConverterService {
        public static injection():any[] {
            return [
                'FieldTypesRegistry',
                FilterConverterService
            ];
        }

        constructor(private FieldTypesRegistry:Components.FieldTypes.IFieldTypesRegistry) {
        }

        //Database query
        public CreateDatabaseQueryFromFilter(metadata:Models.EntityMetadata, filterEntity:Models.Entity):any {
            var result = {};
            if (!metadata || !metadata.Fields) return result;

            for (var i = 0; i < metadata.Fields.length; i++) {
                var metadataField:Models.FieldMetadata = metadata.Fields[i];
                var fieldComponent:Components.FieldTypes.IFieldType = this.FieldTypesRegistry.GetFieldType(metadataField.FieldTypeName, true);
                var filterFields:Models.FieldMetadata[] = fieldComponent.CreateFilterFields(metadataField);

                var filterValues = [];
                for (var j = 0; j < filterFields.length; j++) {
                    var filterField = filterFields[j];
                    var value = filterEntity.Data[filterField.FieldSystemName];
                    filterValues.push(value);
                }

                var fieldQuery = fieldComponent.CreateFilterQuery(metadataField, filterValues);
                Object.copyKeys(fieldQuery, result);
            }
            return result;
        }

        //Filter form
        public CreateFilterFormMetadataFromEntityMetadata(metadata:Models.EntityMetadata):Models.EntityMetadata {
            var result = new Models.EntityMetadata();
            result.Fields = [];
            if (!metadata || !metadata.Fields) return null;

            for (var i = 0; i < metadata.Fields.length; i++) {
                var metadataField:Models.FieldMetadata = metadata.Fields[i];
                var fieldComponent:Components.FieldTypes.IFieldType = this.FieldTypesRegistry.GetFieldType(metadataField.FieldTypeName, true);
                var filterFields:Models.FieldMetadata[] = fieldComponent.CreateFilterFields(metadataField);

                if (filterFields && filterFields.length) result.Fields = result.Fields.concat(filterFields);
            }

            return result;
        }

        //Query string
        public ParseFilterQueryString(metadata:Models.EntityMetadata, routeParams:any):Models.Entity {
            var result = new Models.Entity(null);
            for (var i = 0; i < metadata.Fields.length; i++) {
                var metadataField:Models.FieldMetadata = metadata.Fields[i];
                var fieldComponent:Components.FieldTypes.IFieldType = this.FieldTypesRegistry.GetFieldType(metadataField.FieldTypeName, true);
                fieldComponent.ParseFilterQueryString(metadataField, result, routeParams);
            }
            return result;
        }

        public CreateFilterQueryString(metadata:Models.EntityMetadata, filterEntity:Models.Entity):string {
            var result:string = '';
            if (!filterEntity || !filterEntity.Data) return result;

            for (var i = 0; i < metadata.Fields.length; i++) {
                var metadataField:Models.FieldMetadata = metadata.Fields[i];
                var fieldComponent:Components.FieldTypes.IFieldType = this.FieldTypesRegistry.GetFieldType(metadataField.FieldTypeName, true);
                var filterFields:Models.FieldMetadata[] = fieldComponent.CreateFilterFields(metadataField);

                var filterValues = [];
                for (var j = 0; j < filterFields.length; j++) {
                    var filterField = filterFields[j];
                    var value = filterEntity.Data[filterField.FieldSystemName];
                    filterValues.push(value);
                }

                var fieldQueryString = fieldComponent.CreateFilterQueryString(metadataField, filterValues);
                if (!fieldQueryString) continue;
                for (var k = 0; k < fieldQueryString.length; k++) {
                    var fieldQueryStringComponent = fieldQueryString[k];
                    if (!fieldQueryStringComponent) continue;
                    result += (result ? '&' : '') + fieldQueryStringComponent;
                }
            }
            return result;
        }
    }
}
