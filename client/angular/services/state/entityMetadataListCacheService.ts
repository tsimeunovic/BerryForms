/// <reference path="cacheBaseService.ts" />
/// <reference path="../../interfaces/services/state/IEntityMetadataListCacheService.ts" />
/// <reference path="../../interfaces/services/communication/IMessagingService.ts" />
/// <reference path="../../interfaces/services/repository/IEntityRepositoryService.ts" />
/// <reference path="../../interfaces/services/interaction/INotificationService.ts" />

//Service that stores all entity types
module Services {
    'use strict';

    export class EntityMetadataListCacheService extends Services.CacheBaseService<Models.EntityMetadata[]> implements Services.IEntityMetadataListCacheService {
        /* tslint:disable:member-ordering */
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

        private EntityMetadataCreatedOrModified(entityMetadata:Models.EntityMetadata):void {
            if (this.Data == null) {
                return;
            }

            //Check for existing metadata
            var existingMetadataPredicate:(i:Models.EntityMetadata) => boolean = function (item:Models.EntityMetadata):boolean {
                return item.EntitySystemName === entityMetadata.EntitySystemName;
            };
            var existingMetadata:Models.EntityMetadata = this.Data.single(existingMetadataPredicate);

            //Add new or modify existing
            if (existingMetadata) {
                var existingMetadataIndex:number = this.Data.indexOf(existingMetadata);
                existingMetadata.Fields = entityMetadata.Fields;
                existingMetadata.ModifiedDate = entityMetadata.ModifiedDate;
                this.Data.splice(existingMetadataIndex, 1);
                this.Data.unshift(existingMetadata);
            } else {
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
            } else {
                this.NotificationService.HandleErrorsModel(errorsModel);
            }

            this.IsLoading = false;
            this.MessagingService.Messages.Loading.Finished.publish(Static.LoadingType.EntityMetadataListCache);
        }

        public LoadEntityMetadataFromCache(entitySystemName:string, callback:(entityMetadata:Models.EntityMetadata, errorsModel:any) => void):void {
            var predicateFunction:(it:Models.EntityMetadata) => boolean = function (it:Models.EntityMetadata):boolean {
                return it.EntitySystemName === entitySystemName;
            };

            if (this.IsLoading) {
                //Have to wait for new data
                var subscription:() => void = this.MessagingService.Messages.Cache.MetadataList.Loaded.subscribe(
                    function (entityMetadataList:Models.EntityMetadata[]):void {
                        subscription();
                        var result:Models.EntityMetadata = entityMetadataList.single(predicateFunction);
                        callback(result, null);
                    });
            } else {
                //Can select from existing data
                var result:Models.EntityMetadata = this.Data.single(predicateFunction);
                callback(result, null);
            }
        }
    }
}
