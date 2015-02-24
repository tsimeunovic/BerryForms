/// <reference path="../../../models/core/entityModel.ts" />
/// <reference path="../../../models/core/entityMetadataModel.ts" />
/// <reference path="../../../components/fieldTypes/select/selectFieldOptionMetadataModel.ts" />

'use strict';

//Interface for Entity mapping service (used to map and deserialize Entity/EntityMetadata/FieldMetadata)
module Services {
    export interface IEntityModelMapperService {
        MapEntityToEntityMetadataModel(entity:Models.Entity):Models.EntityMetadata;
        MapFieldsMetadataToEntityModels(fieldsMetadata:Models.FieldMetadata[]):Models.Entity[];
        MapEntityModelToFieldMetadata(entity:Models.Entity):Models.FieldMetadata;
        DeserializeEntityMetadataModel(entityMetadataJson:any):Models.EntityMetadata;
        DeserializeEntityModel(entityJson:any):Models.Entity;
        CloneEntityModel(entity:Models.Entity):Models.Entity;

        //Fields converting
        GetSelectFieldOptionFromEntityJson(entityJson:any, entityMetadata:Models.EntityMetadata):Models.SelectFieldOptionMetadata;
        GetSelectFieldOptionFromStringProperty(sourceObject:any, propertyName:string):Models.SelectFieldOptionMetadata;
        GetSelectFieldOptionsFromArrayProperty(sourceObject:any, propertyName:string):Models.SelectFieldOptionMetadata[];
    }
}
