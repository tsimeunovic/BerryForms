/// <reference path="../../extensions/stringExtensions.ts" />
/// <reference path="../../config/config.ts" />
/// <reference path="../interfaces/directives/IDirective.ts" />
/// <reference path="../interfaces/services/localization/ILocalizationService.ts" />
/// <reference path="../interfaces/services/state/IEntityMetadataListCacheService.ts" />

declare
var Chartist:any;

//Directive that creates chart and description for entity activity summary
module Directives {
    'use strict';

    export class DashboardActivityItemChart implements Directives.IDirective {
        /* tslint:disable:member-ordering */
        public static injection():any[] {
            return [
                'LocalizationService',
                'EntityMetadataListCacheService',
                DashboardActivityItemChart.DirectiveOptions
            ];
        }

        private static LocalizationService:Services.ILocalizationService;
        private static EntityMetadataListCacheService:Services.IEntityMetadataListCacheService;

        public static DirectiveOptions(localizationService:Services.ILocalizationService,
                                       entityMetadataListCacheService:Services.IEntityMetadataListCacheService):any {
            DashboardActivityItemChart.EntityMetadataListCacheService = entityMetadataListCacheService;
            DashboardActivityItemChart.LocalizationService = localizationService;
            return {
                restrict: 'A',
                scope: '=',
                replace: true,
                templateUrl: 'angular/views/dashboardActivityItemChart.html',
                link: function ($scope:any, $linkElement:any, $linkAttributes:any):void {
                    var instance:Directives.IDirective = new DashboardActivityItemChart();
                    instance.Link($scope, $linkElement, $linkAttributes);
                }
            };
        }

        public Scope:any;
        private Element:any;
        private ChartElement:any;

        public Link($scope:any, $linkElement:any, $linkAttributes:any):void {
            this.Scope = $scope;
            this.Element = $linkElement;
            this.ChartElement = this.Element[0].querySelector('.chartContainer');
            this.CreateSummaryItemModel($scope.activity);
        }

        private CreateSummaryItemModel(activitySummary:any):void {
            //Create model
            this.Scope.SummaryItem = {
                LegendTitle: DashboardActivityItemChart.LocalizationService.Resources.TotalCount.format([activitySummary.TotalOperationsCount]),
                TotalCount: activitySummary.TotalOperationsCount,
                Legend: [
                    {
                        title: DashboardActivityItemChart.LocalizationService.Resources.Created,
                        count: activitySummary.CreatedCount || 0,
                        className: 'created'
                    },
                    {
                        title: DashboardActivityItemChart.LocalizationService.Resources.Updated,
                        count: activitySummary.UpdatedCount || 0,
                        className: 'updated'
                    },
                    {
                        title: DashboardActivityItemChart.LocalizationService.Resources.Deleted,
                        count: activitySummary.DeletedCount || 0,
                        className: 'deleted'
                    }
                ],
                ChartData: {
                    series: []
                },
                ChartOptions: {
                    showLabel: false,
                    labelDirection: 'neutral'
                }
            };

            //Insert data
            if (activitySummary.CreatedCount) {
                this.Scope.SummaryItem.ChartData.series.push({
                    data: activitySummary.CreatedCount,
                    className: 'ct-series-a createdSeries'
                });
            }
            if (activitySummary.UpdatedCount) {
                this.Scope.SummaryItem.ChartData.series.push({
                    data: activitySummary.UpdatedCount,
                    className: 'ct-series-b updatedSeries'
                });
            }
            if (activitySummary.DeletedCount) {
                this.Scope.SummaryItem.ChartData.series.push({
                    data: activitySummary.DeletedCount,
                    className: 'ct-series-c deletedSeries'
                });
            }

            var entitySystemName:string = activitySummary.Collection;
            DashboardActivityItemChart.EntityMetadataListCacheService.LoadEntityMetadataFromCache(
                entitySystemName, this.LoadEntityMetadataCompleted.bind(this));
        }

        private LoadEntityMetadataCompleted(metadata:Models.EntityMetadata, errorsModel:any):void {
            if (errorsModel === null) {
                this.Scope.SummaryItem.EntitySystemName = metadata.EntitySystemName;
                this.Scope.SummaryItem.EntityName = metadata.EntityName;
            } else {
                //TODO: Fallback for model
            }

            //Draw chart
            Chartist.Pie(this.ChartElement, this.Scope.SummaryItem.ChartData, this.Scope.SummaryItem.ChartOptions);
        }
    }
}
