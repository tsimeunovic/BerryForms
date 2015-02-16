/// <reference path="./relationFieldMetadataModel.ts" />
/// <reference path="./../../../data/createFieldFormFields.ts" />
/// <reference path="../../../models/core/entityMetadataModel.ts" />
/// <reference path="../select/selectFieldMetadataModel.ts" />
/// <reference path="../select/selectFieldOptionMetadataModel.ts" />
/// <reference path="../../../interfaces/localization/IResources.ts" />
/// <reference path="../../../interfaces/services/state/IEntityMetadataListCacheService.ts" />
/// <reference path="../../../services/localization/localizationService.ts" />
/// <reference path="../../../../config/config.ts" />
/// <reference path="../../../../extensions/arrayExtensions.ts" />

'use strict';
var _global:any = this;
declare var angular:any;

module Data {
    export class CreateRelationFieldFormFields {
        public static GetData():Models.EntityMetadata {
            var relationFields = Data.CreateFieldFormFields.GetData(null);
            relationFields.Fields = relationFields.Fields.concat([
                CreateRelationFieldFormFields.RelatedEntityField()
            ]);
            return relationFields;
        }

        private static RelatedEntityField():Models.SelectFieldMetadata {
            var result = new Models.SelectFieldMetadata();
            result.FieldSystemName = 'RelatedEntity';
            result.FieldName = Services.LocalizationService.Resources.RelatedEntity;
            result.FieldDescription = result.FieldName;
            result.Required = true;

            //List of entity types
            result.Values = [];
            var EntityMetadataListCacheService:Services.IEntityMetadataListCacheService = _global.Instances.EntityMetadataListCacheService;
            angular.forEach(EntityMetadataListCacheService.Data, function (entityMetadata:Models.EntityMetadata, index:number) {
                var optionItem = new Models.SelectFieldOptionMetadata(entityMetadata.EntityName, entityMetadata.EntitySystemName);
                result.Values.add(optionItem);
            });

            return result;
        }
    }
}
