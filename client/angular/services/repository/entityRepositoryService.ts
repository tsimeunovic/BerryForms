/// <reference path="../../models/core/entityMetadataModel.ts" />
/// <reference path="../../interfaces/services/repository/IEntityRepositoryService.ts" />
/// <reference path="../../interfaces/services/repository/IUrlLocatorService.ts" />
/// <reference path="../../components/fieldTypes/boolean/booleanFieldMetadataModel.ts" />
/// <reference path="../../components/fieldTypes/date/dateFieldMetadataModel.ts" />
/// <reference path="../../components/fieldTypes/list/listFieldMetadataModel.ts" />
/// <reference path="../../components/fieldTypes/select/selectFieldMetadataModel.ts" />
/// <reference path="../../components/fieldTypes/textarea/textareaFieldMetadataModel.ts" />
/// <reference path="../../components/fieldTypes/text/textFieldMetadataModel.ts" />
/// <reference path="../../../static/pluginOperations.ts" />

'use strict';

//Service that communicates with server side Node api and retrieves/saves data
module Services {
    export class EntityRepositoryService implements Services.IEntityRepositoryService {
        public static injection():any[] {
            return [
                'HttpWrapperService',
                'UrlLocatorService',
                'EntityModelMapperService',
                'QueryCreatorService',
                'PluginsExecutorService',
                EntityRepositoryService
            ];
        }

        constructor(private HttpWrapperService:Services.IHttpWrapperService,
                    private UrlLocatorService:Services.IUrlLocatorService,
                    private EntityModelMapperService:Services.IEntityModelMapperService,
                    private QueryCreatorService:Services.IQueryCreatorService,
                    private PluginsExecutorService:Services.IPluginsExecutorService) {
        }

        public LoadEntityMetadata(entityName:string, callback:(metadata:Models.EntityMetadata, errorsModel:any)=>void):void {
            var _this = this;
            var url = this.UrlLocatorService.GetUrlForEntityMetadataRetrieve(entityName);
            this.HttpWrapperService.Get(url, 'LoadAllMetadata').then(
                //Success
                function (data) {
                    var metadata:Models.EntityMetadata = _this.EntityModelMapperService.DeserializeEntityMetadataModel(data);
                    callback(metadata, null);
                },
                //Error
                function (errorsData) {
                    callback(null, errorsData);
                });
        }

        public SaveEntityMetadata(entityMetadata:Models.EntityMetadata, callback:(savedMetadata:Models.EntityMetadata, errorsModel:any)=>void):void {
            var _this = this;
            var pluginContextInitial = Models.PluginContext.CreateForMetadata(entityMetadata, entityMetadata.CreatedDate ? Static.PluginOperation.Update : Static.PluginOperation.Create);
            this.PluginsExecutorService.ExecuteAllPluginsFor(pluginContextInitial, function (pluginContext:Models.PluginContext<Models.EntityMetadata>) {
                if (pluginContext.CancelPluginOperation) {
                    callback(null, pluginContext.CancellationPluginErrorModel);
                    return;
                }

                var url = _this.UrlLocatorService.GetUrlForEntityMetadataSave(entityMetadata.EntitySystemName);
                _this.HttpWrapperService.Post(url, 'SaveEntityMetadata', pluginContext.Data).then(
                    //Success
                    function (data) {
                        var metadata:Models.EntityMetadata = _this.EntityModelMapperService.DeserializeEntityMetadataModel(data);
                        callback(metadata, null);
                    },
                    //Error
                    function (errorsData) {
                        callback(null, errorsData);
                    });
            });
        }

        public LoadAllEntityMetadata(callback:(entities:Models.EntityMetadata[], errorsModel:any)=>void):void {
            var _this = this;
            var url = this.UrlLocatorService.GetUrlForEntityMetadataListRetrieve();
            this.HttpWrapperService.Get(url, 'LoadAllMetadata').then(
                //Success
                function (data) {
                    var result = [];
                    for (var i = 0; i < data.length; i++) {
                        var metadataJson = data[i];
                        var metadata:Models.EntityMetadata = _this.EntityModelMapperService.DeserializeEntityMetadataModel(metadataJson);
                        result.push(metadata);
                    }
                    callback(result, null);
                },
                //Error
                function (errorsData) {
                    callback(null, errorsData);
                });
        }

        public LoadEntity(entityName:string, entityId:number, callback:(entity:Models.Entity, errorsModel:any)=>void):void {
            var _this = this;
            var url = this.UrlLocatorService.GetUrlForEntityRetrieve(entityName, entityId);
            this.HttpWrapperService.Get(url, 'LoadEntity').then(
                //Success
                function (data) {
                    var entity:Models.Entity = _this.EntityModelMapperService.DeserializeEntityModel(data);
                    callback(entity, null);
                },
                //Error
                function (errorsData) {
                    callback(null, errorsData);
                });
        }

        public SaveEntity(entity:Models.Entity, callback:(savedEntity:Models.Entity, errorsModel:any)=>void):void {
            var _this = this;
            var pluginContextInitial = Models.PluginContext.CreateForEntity(entity, entity.CreatedDate ? Static.PluginOperation.Update : Static.PluginOperation.Create);
            this.PluginsExecutorService.ExecuteAllPluginsFor(pluginContextInitial, function (pluginContext:Models.PluginContext<Models.Entity>) {
                if (pluginContext.CancelPluginOperation) {
                    callback(null, pluginContext.CancellationPluginErrorModel);
                    return;
                }

                var url = _this.UrlLocatorService.GetUrlForEntitySave(entity.EntitySystemName);
                _this.HttpWrapperService.Post(url, 'SaveEntity', pluginContext.Data).then(
                    //Success
                    function (data) {
                        var entityModel = _this.EntityModelMapperService.DeserializeEntityModel(data);
                        callback(entityModel, null);
                    },
                    //Error
                    function (errorsData) {
                        callback(null, errorsData);
                    });
            });
        }

        public DeleteEntity(entity:Models.Entity, callback:(deletedEntity:Models.Entity, errorsModel:any)=>void):void {
            var _this = this;
            var pluginContextInitial = Models.PluginContext.CreateForEntity(entity, Static.PluginOperation.Delete);
            this.PluginsExecutorService.ExecuteAllPluginsFor(pluginContextInitial, function (pluginContext:Models.PluginContext<Models.Entity>) {
                if (pluginContext.CancelPluginOperation) {
                    callback(null, pluginContext.CancellationPluginErrorModel);
                    return;
                }

                var url = _this.UrlLocatorService.GetUrlForEntityDelete(entity.EntitySystemName, entity.Id);
                _this.HttpWrapperService.Delete(url, 'DeleteEntity').then(
                    //Success
                    function () {
                        callback(entity, null);
                    },
                    //Error
                    function (errorsData) {
                        callback(null, errorsData);
                    });
            });
        }

        public LoadAllEntities(entityName:string, callback:(entities:Models.Entity[], errorsModel:any)=>void):void {
            var _this = this;
            var url = this.UrlLocatorService.GetUrlForEntityListRetrieve(entityName);
            this.HttpWrapperService.Get(url, 'LoadAllEntities').then(
                //Success
                function (data) {
                    var result = [];
                    for (var i = 0; i < data.length; i++) {
                        var entityJson = data[i];
                        var entity:Models.Entity = _this.EntityModelMapperService.DeserializeEntityModel(entityJson);
                        result.push(entity);
                    }
                    callback(result, null);
                },
                //Error
                function (errorsData) {
                    callback(null, errorsData);
                });
        }

        public LoadPagedEntities(entityName:string, pageIndex:number, pageSize:number, callback:(pagedData:any, errorsModel:any)=>void):void {
            var _this = this;
            var url = this.UrlLocatorService.GetUrlForPagedEntityListRetrieve(entityName, pageIndex, pageSize);
            this.HttpWrapperService.Get(url, 'LoadPagedEntities').then(
                //Success
                function (data:any) {
                    //data = { EntitySystemName, Page: { PageNumber, TotalCount, StartIndex, LoadedCount, VersionIdentifier }, List : [] }
                    var result = [];
                    for (var i = 0; i < data.List.length; i++) {
                        var entityJson = data.List[i];
                        var entity:Models.Entity = _this.EntityModelMapperService.DeserializeEntityModel(entityJson);
                        result.push(entity);
                    }
                    //Replace data list with deserialized entities
                    data.List = result;
                    callback(data, null);
                },
                //Error
                function (errorsData) {
                    callback(null, errorsData);
                });
        }

        public LoadSearchResults(entityMetadata:Models.EntityMetadata, searchExpression:string, callback:(searchExpression:string, searchResults:Models.SelectFieldOptionMetadata[], totalResultsCount:number, errorsModel:any)=>void):void {
            var _this = this;
            var query = this.QueryCreatorService.CreateRelationSearchQuery(entityMetadata, searchExpression);
            var searchPageSize = Config.Client.SearchListSize / 2; //Can use half size, because search will retrieve next page as well
            var url = this.UrlLocatorService.GetUrlForFilteredListRetrieve(entityMetadata.EntitySystemName, 0, searchPageSize);

            this.HttpWrapperService.Post(url, 'Search', query).then(
                //Success
                function (data) {
                    //data = { EntitySystemName, Query, Page: { PageNumber, TotalCount, StartIndex, LoadedCount, VersionIdentifier }, List : [] }
                    var result = [];
                    for (var i = 0; i < data.List.length; i++) {
                        var entityJson = data.List[i];
                        var entity:Models.SelectFieldOptionMetadata = _this.EntityModelMapperService.GetSelectFieldOptionFromEntityJson(entityJson, entityMetadata);
                        result.push(entity);
                    }
                    callback(searchExpression, result, data.Page.TotalCount, null);
                },
                //Error
                function (errorsData) {
                    callback(searchExpression, null, null, errorsData);
                });
        }

        public LoadPagedFilteredResults(entityName:string, query:any, pageIndex:number, pageSize:number, callback:(pagedData:any, errorsModel:any)=>void):void {
            var _this = this;
            var url = this.UrlLocatorService.GetUrlForFilteredListRetrieve(entityName, pageIndex, pageSize);
            this.HttpWrapperService.Post(url, 'Filter', query).then(
                //Success
                function (data:any) {
                    //data = { EntitySystemName, Page: { PageNumber, TotalCount, StartIndex, LoadedCount, VersionIdentifier }, List : [] }
                    var result = [];
                    for (var i = 0; i < data.List.length; i++) {
                        var entityJson = data.List[i];
                        var entity:Models.Entity = _this.EntityModelMapperService.DeserializeEntityModel(entityJson);
                        result.push(entity);
                    }
                    //Replace data list with deserialized entities
                    data.List = result;
                    callback(data, null);
                },
                //Error
                function (errorsData) {
                    callback(null, errorsData);
                });
        }
    }
}
