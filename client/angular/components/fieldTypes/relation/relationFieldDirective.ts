/// <reference path="../../../directives/fieldDirectiveBase.ts" />
/// <reference path="../../../interfaces/services/repository/IEntityRepositoryService.ts" />
/// <reference path="../../../interfaces/services/state/IEntityMetadataListCacheService.ts" />
/// <reference path="../../../interfaces/services/system/IRedirectService.ts" />

module Directives {
    'use strict';

    export class RelationField extends Directives.BaseField {
        /* tslint:disable:member-ordering */
        public static injection():any[] {
            return [
                'EntityRepositoryService',
                'EntityMetadataListCacheService',
                'RedirectService',
                RelationField.RelationDirectiveOptions
            ];
        }

        private static EntityRepositoryService:Services.IEntityRepositoryService;
        private static EntityMetadataListCacheService:Services.IEntityMetadataListCacheService;
        private static RedirectService:Services.IRedirectService;

        public static RelationDirectiveOptions(entityRepositoryService:Services.IEntityRepositoryService,
                                               entityMetadataListCacheService:Services.IEntityMetadataListCacheService,
                                               redirectService:Services.IRedirectService):any {
            RelationField.EntityRepositoryService = entityRepositoryService;
            RelationField.EntityMetadataListCacheService = entityMetadataListCacheService;
            RelationField.RedirectService = redirectService;
            return BaseField.DirectiveOptions('Relation', RelationField.StaticConstructor);
        }

        public static StaticConstructor():Directives.RelationField {
            return new Directives.RelationField();
        }

        public Link($scope:any, $linkElement:any, $linkAttributes:any):void {
            super.Link($scope, $linkElement, $linkAttributes);
            this.Scope.SelectItem = this.SelectItem.bind(this);
            this.Scope.GetFollowItemUrl = this.GetFollowItemUrl.bind(this);
            this.Scope.EntitySystemName = this.Scope.field.RelatedEntity.Value;

            this.Scope.SearchExpression = null;
            this.Scope.SearchTimer = null;
            this.Scope.SearchResults = null;
            this.WatchSearchExpression();
        }

        private WatchSearchExpression():void {
            var _this:RelationField = this;
            this.Scope.$watch('SearchExpression', function ():void {
                _this.ScheduleSearch();
            });
        }

        private ScheduleSearch():void {
            var _this:RelationField = this;

            //Invalidate old results
            this.Scope.SearchResults = null;

            //Cancel old schedule if exists
            if (this.Scope.SearchTimer) {
                clearTimeout(this.Scope.SearchTimer);
                this.Scope.SearchTimer = null;
            }

            if (this.Scope.SearchExpression &&
                this.Scope.SearchExpression.length >= Config.Client.SearchMinExpressionLength) {
                //Schedule new search
                this.Scope.SearchTimer = setTimeout(function ():void {
                    _this.Scope.SearchTimer = null;
                    _this.SearchForEntity(_this.Scope.SearchExpression);
                }, Config.Client.SearchTypingWaitTimeMs);
            }
        }

        private SearchForEntity(searchExpression:string):void {
            var _this:RelationField = this;

            RelationField.EntityMetadataListCacheService.LoadEntityMetadataFromCache(
                this.Scope.EntitySystemName,
                function (entityMetadata:Models.EntityMetadata):void {
                    RelationField.EntityRepositoryService.LoadSearchResults(
                        entityMetadata, searchExpression,
                        _this.SearchForEntityCompleted.bind(_this));
                });
        }

        private SearchForEntityCompleted(searchExpression:string,
                                         searchResults:Models.SelectFieldOptionMetadata[],
                                         totalResultsCount:number,
                                         errorsModel:any):void {
            if (searchExpression !== this.Scope.SearchExpression) {
                return;
            }

            this.Scope.SearchResults = searchResults;
            this.Scope.SearchResults.HasError = errorsModel != null;
            this.Scope.SearchResults.MoreResults = totalResultsCount - searchResults.length;
        }

        private SelectItem(item:Models.SelectFieldOptionMetadata):void {
            this.Scope.Entity.Data[this.Scope.field.FieldSystemName] = item;
            this.Scope.SearchExpression = null;
            this.Scope.SearchResults = null;
        }

        private GetFollowItemUrl(item:Models.SelectFieldOptionMetadata):string {
            if (!item) {
                return null;
            }
            var entityId:number = parseInt(item.Value, 10);
            return RelationField.RedirectService.GetEditEntityUrl(this.Scope.EntitySystemName, entityId);
        }
    }
}
