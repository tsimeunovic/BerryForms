/// <reference path="./relationFieldMetadataModel.ts" />
/// <reference path="../baseFieldController.ts" />
/// <reference path="../../../interfaces/services/repository/IEntityRepositoryService.ts" />
/// <reference path="../../../interfaces/services/state/IEntityMetadataListCacheService.ts" />
/// <reference path="../../../interfaces/services/system/IRedirectService.ts" />

module Components.FieldTypes {
    'use strict';

    export class RelationFieldController extends BaseFieldController<Models.RelationFieldMetadata> {
        /* tslint:disable:member-ordering */
        public static injection():any[] {
            return [
                '$scope',
                'EntityRepositoryService',
                'EntityMetadataListCacheService',
                'RedirectService',
                RelationFieldController
            ];
        }

        constructor(Scope:any,
                    private EntityRepositoryService:Services.IEntityRepositoryService,
                    private EntityMetadataListCacheService:Services.IEntityMetadataListCacheService,
                    private RedirectService:Services.IRedirectService) {
            super(Scope);
        }

        public SearchExpression:string;
        public SearchTimer:number;
        public SearchResults:any;

        public ScheduleSearch():void {
            var _this:RelationFieldController = this;

            //Invalidate old results
            this.SearchResults = null;

            //Cancel old schedule if exists
            if (this.SearchTimer) {
                clearTimeout(this.SearchTimer);
                this.SearchTimer = null;
            }

            if (this.SearchExpression &&
                this.SearchExpression.length >= Config.Client.SearchMinExpressionLength) {
                //Schedule new search
                this.SearchTimer = setTimeout(function ():void {
                    _this.SearchTimer = null;
                    _this.SearchForEntity(_this.SearchExpression);
                }, Config.Client.SearchTypingWaitTimeMs);
            }
        }

        public SelectItem(item:Models.SelectFieldOptionMetadata):void {
            this.SetBoundFieldValue(item);
            this.SearchExpression = null;
            this.SearchResults = null;
        }

        public GetFollowItemUrl(item:Models.SelectFieldOptionMetadata):string {
            if (!item) {
                return null;
            }
            var entityId:number = parseInt(item.Value, 10);
            return this.RedirectService.GetEditEntityUrl(this.Entity.EntitySystemName, entityId);
        }

        private SearchForEntity(searchExpression:string):void {
            var _this:RelationFieldController = this;

            _this.EntityMetadataListCacheService.LoadEntityMetadataFromCache(
                _this.FieldMetadata.RelatedEntity.Value,
                function (entityMetadata:Models.EntityMetadata):void {
                    _this.EntityRepositoryService.LoadSearchResults(
                        entityMetadata, searchExpression,
                        _this.SearchForEntityCompleted.bind(_this));
                });
        }

        private SearchForEntityCompleted(searchExpression:string,
                                         searchResults:Models.SelectFieldOptionMetadata[],
                                         totalResultsCount:number,
                                         errorsModel:any):void {
            if (searchExpression !== this.SearchExpression) {
                return;
            }

            this.SearchResults = searchResults;
            this.SearchResults.HasError = errorsModel != null;
            this.SearchResults.MoreResults = totalResultsCount - searchResults.length;
        }
    }
}
