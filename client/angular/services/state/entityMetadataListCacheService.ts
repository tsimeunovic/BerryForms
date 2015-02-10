/// <reference path="cacheBaseService.ts" />
/// <reference path="../../interfaces/services/state/IEntityMetadataListCacheService.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../../interfaces/services/repository/IEntityRepositoryService.ts" />

'use strict';

//Service that stores all entity types
module Services {
    export class EntityMetadataListCacheService extends Services.CacheBaseService<Models.EntityMetadata[]> implements Services.IEntityMetadataListCacheService {
        public static injection():any[] {
            return [
                'MessagingService',
                'EntityRepositoryService',
                'NotificationService',
                EntityMetadataListCacheService
            ];
        }

        constructor(private MessagingService:Services.IMessagingService,
                    private EntityRepositoryService:Services.IEntityRepositoryService,
                    private NotificationService:Services.INotificationService) {
            super();
            this.Setup();
        }

        private Setup():void {
            this.RegisterDependencies();
            this.WatchForChanges();
            this.LoadData(null);

            _global.Instances = _global.Instances || {};
            _global.Instances.EntityMetadataListCacheService = this;
        }

        private RegisterDependencies():void {
            //No external dependencies cause metadata list reload
        }

        private WatchForChanges():void {
            this.MessagingService.Messages.Metadata.Created.subscribe(this.EntityMetadataCreatedOrModified.bind(this));
            this.MessagingService.Messages.Metadata.Modified.subscribe(this.EntityMetadataCreatedOrModified.bind(this));
        }

        private EntityMetadataCreatedOrModified(entityMetadata:Models.EntityMetadata) {
            if (this.Data == null) return;

            //Check for existing metadata
            var existingMetadataPredicate = function (item:Models.EntityMetadata) {
                return item.EntitySystemName == entityMetadata.EntitySystemName;
            };
            var existingMetadata = this.Data.single(existingMetadataPredicate);

            //Add new or modify existing
            if (existingMetadata) {
                var existingMetadataIndex:number = this.Data.indexOf(existingMetadata);
                existingMetadata.Fields = entityMetadata.Fields;
                existingMetadata.ModifiedDate = entityMetadata.ModifiedDate;
                this.Data.splice(existingMetadataIndex, 1);
                this.Data.unshift(existingMetadata);
            }
            else {
                this.Data.unshift(entityMetadata);
            }

            this.MessagingService.Messages.Cache.MetadataList.Loaded.publish(this.Data);
        }

        public InvalidateCache():void {
            this.Data = null;
            this.LoadData(null);
            this.MessagingService.Messages.Cache.MetadataList.Invalidated.publish();
        }

        public LoadData(argument:any):void {
            this.IsLoading = true;
            this.MessagingService.Messages.Loading.Started.publish(Static.LoadingType.EntityMetadataListCache);
            this.EntityRepositoryService.LoadAllEntityMetadata(this.LoadDataCompleted.bind(this));
        }

        public LoadDataCompleted(data:Models.EntityMetadata[], errorsModel:any):void {
            if (errorsModel == null) {
                this.Data = data;
                this.MessagingService.Messages.Cache.MetadataList.Loaded.publish(data);
            }
            else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }

            this.IsLoading = false;
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.EntityMetadataListCache);
        }

        public LoadEntityMetadataFromCache(entitySystemName:string, callback:(entityMetadata:Models.EntityMetadata)=>void):void {
            var predicateFunction = function (it:Models.EntityMetadata) {
                return it.EntitySystemName == entitySystemName;
            };

            if (this.IsLoading) {
                //Have to wait for new data
                var subscription = this.MessagingService.Messages.Cache.MetadataList.Loaded.subscribe(
                    function (entityMetadataList:Models.EntityMetadata[]) {
                        subscription();
                        var result = entityMetadataList.single(predicateFunction);
                        callback(result);
                    });
            }
            else {
                //Can select from existing data
                var result = this.Data.single(predicateFunction);
                callback(result);
            }
        }
    }
}
