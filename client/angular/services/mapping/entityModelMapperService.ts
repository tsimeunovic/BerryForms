/// <reference path="./objectMapperBaseService.ts" />
/// <reference path="../../interfaces/components/fieldTypes/IFieldTypesRegistry.ts" />
/// <reference path="../../interfaces/services/system/INamingConventionsService.ts" />
/// <reference path="../../interfaces/services/mapping/IEntityModelMapperService.ts" />
/// <reference path="../../interfaces/services/interaction/INotificationService.ts" />
/// <reference path="../../components/fieldTypes/boolean/booleanFieldMetadataModel.ts" />
/// <reference path="../../components/fieldTypes/date/dateFieldMetadataModel.ts" />
/// <reference path="../../components/fieldTypes/text/textFieldMetadataModel.ts" />
/// <reference path="../../components/fieldTypes/textarea/textareaFieldMetadataModel.ts" />
/// <reference path="../../components/fieldTypes/list/listFieldMetadataModel.ts" />
/// <reference path="../../components/fieldTypes/select/selectFieldMetadataModel.ts" />
/// <reference path="../../../extensions/objectExtensions.ts" />
/// <reference path="../../../config/config.ts" />

'use strict';
var _global:any = this;
declare var angular:any;

//Service used to map and deserialize Entity/EntityMetadata/FieldMetadata
module Services {
    export class EntityModelMapperService extends Services.ObjectMapperBaseService implements Services.IEntityModelMapperService {
        public static injection():any[] {
            return [
                'NamingConventionsService',
                'FieldTypesRegistry',
                'NotificationService',
                'LocalizationService',
                EntityModelMapperService
            ];
        }

        constructor(private NamingConventionsService:Services.INamingConventionsService,
                    private FieldTypesRegistry:Components.FieldTypes.IFieldTypesRegistry,
                    private NotificationService:Services.INotificationService,
                    private LocalizationService:Services.ILocalizationService) {
            super();
        }

        private EntityToMetadataAutoProperties:string[] = ['EntityName', 'EntityDescription'];
        private FieldMetadataToEntityAutoProperties:string[] = ['FieldName', 'FieldDescription', 'Required', 'DisplayInListName'];
        private EntityToFieldMetadataAutoProperties:string[] = ['FieldName', 'FieldDescription', 'Required', 'DisplayInListName'];

        public MapEntityToEntityMetadataModel(entity:Models.Entity):Models.EntityMetadata {
            var result = new Models.EntityMetadata();
            this.AutomapProperties(entity.Data, result, this.EntityToMetadataAutoProperties);
            result.Fields = [];
            result.EntitySystemName = this.NamingConventionsService.GetSystemEntityName(result.EntityName);
            result.IconClassName = entity.Data.IconClassName.Value.substr(Config.Client.SystemIconIdentifier.length);
            result.IconColorHex = entity.Data.IconColorHex.Value.substr(Config.Client.SystemColorIdentifier.length);
            return result;
        }

        public MapFieldsMetadataToEntityModels(fieldsMetadata:Models.FieldMetadata[]):Models.Entity[] {
            var _this = this;
            var result:Models.Entity[] = [];
            angular.forEach(fieldsMetadata, function (fieldMetadata:Models.FieldMetadata, index:number) {
                var entity = _this.MapFieldMetadataToEntityModel(fieldMetadata);
                entity.Id = index;
                result.push(entity);
            });
            return result;
        }

        private MapFieldMetadataToEntityModel(fieldMetadata:Models.FieldMetadata):Models.Entity {
            var fieldTypeComponent = this.FieldTypesRegistry.GetFieldType(fieldMetadata.FieldTypeName, false);
            if (!fieldTypeComponent) {
                var errorMessage = this.LocalizationService.Resources.NonExistingFieldType.format([fieldMetadata.FieldTypeName]);
                this.NotificationService.NotifyMessage(errorMessage, Services.NotificationSeverity.Error);
                return null;
            }

            var result = new Models.Entity(null);
            result.EntitySystemName = fieldMetadata.FieldSystemName;
            result.Data['FieldTypeName'] = new Models.SelectFieldOptionMetadata(Services.LocalizationService.Resources[fieldTypeComponent.FieldName + 'Field'], fieldTypeComponent.FieldName);
            this.AutomapProperties(fieldMetadata, result.Data, this.FieldMetadataToEntityAutoProperties.concat(fieldMetadata.FieldSpecialProperties));
            fieldMetadata.MapAdditionalProperties(result, this);
            return result;
        }

        public MapEntityModelToFieldMetadata(entity:Models.Entity):Models.FieldMetadata {
            var fieldType:string = entity.Data['FieldTypeName'].Value;

            //Create metadata model
            var fieldTypeComponent = this.FieldTypesRegistry.GetFieldType(fieldType, false);
            if (!fieldTypeComponent) {
                var errorMessage = this.LocalizationService.Resources.NonExistingFieldType.format([fieldType]);
                this.NotificationService.NotifyMessage(errorMessage, Services.NotificationSeverity.Error);
                return null;
            }

            //Map properties
            var fieldTypeMetadataInstance = fieldTypeComponent.CreateMetadata();
            this.AutomapProperties(entity.Data, fieldTypeMetadataInstance, this.EntityToFieldMetadataAutoProperties.concat(fieldTypeMetadataInstance.FieldSpecialProperties));
            fieldTypeMetadataInstance.MapAdditionalProperties(entity, this);
            fieldTypeMetadataInstance.FieldSystemName = this.NamingConventionsService.GetSystemFieldName(fieldTypeMetadataInstance.FieldName);
            fieldTypeMetadataInstance.FieldTypeName = fieldType;

            return fieldTypeMetadataInstance;
        }

        public DeserializeEntityMetadataModel(entityMetadataJson:any):Models.EntityMetadata {
            var result = new Models.EntityMetadata();
            this.AutomapProperties(entityMetadataJson, result, null);
            result.Fields = this.DeserializeEntityMetadataModelFields(entityMetadataJson);
            return result;
        }

        public CloneEntityModel(entity:Models.Entity):Models.Entity {
            var objectClone:any = Object.clone(entity);
            return this.DeserializeEntityModel(objectClone);
        }

        public DeserializeEntityModel(entityJson:any):Models.Entity {
            var result = new Models.Entity(entityJson.EntitySystemName);
            result.Id = entityJson.Id;
            result.CreatedDate = entityJson.CreatedDate;
            result.ModifiedDate = entityJson.ModifiedDate;
            result.Data = entityJson.Data;
            return result;
        }

        public GetSelectFieldOptionFromEntityJson(entityJson:any, entityMetadata:Models.EntityMetadata):Models.SelectFieldOptionMetadata {
            var entity:Models.Entity = this.DeserializeEntityModel(entityJson);
            var displayName:string = entity.GetDisplayName(entityMetadata);
            return new Models.SelectFieldOptionMetadata(displayName, entity.Id.toString());
        }

        private DeserializeEntityMetadataModelFields(entityFieldsJson:any):Models.FieldMetadata[] {
            var _this = this;
            var result:Models.FieldMetadata[] = [];

            if (entityFieldsJson.Fields != null) {
                for (var i = 0; i < entityFieldsJson.Fields.length; i++) {
                    var itemJson = entityFieldsJson.Fields[i];
                    var item = _this.DeserializeEntityMetadataModelField(itemJson);
                    result.add(item);
                }
            }

            return result;
        }

        private DeserializeEntityMetadataModelField(entityFieldJson:any):Models.FieldMetadata {
            var fieldType:string = entityFieldJson.FieldTypeName;

            //Create metadata model
            var fieldTypeComponent = this.FieldTypesRegistry.GetFieldType(fieldType, false);
            if (!fieldTypeComponent) {
                var errorMessage = this.LocalizationService.Resources.NonExistingFieldType.format([fieldType]);
                this.NotificationService.NotifyMessage(errorMessage, Services.NotificationSeverity.Error);
                return null;
            }

            var fieldTypeMetadataInstance = fieldTypeComponent.CreateMetadata();
            this.AutomapProperties(entityFieldJson, fieldTypeMetadataInstance, null);
            return fieldTypeMetadataInstance;
        }
    }
}