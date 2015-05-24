/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/extensions/stringExtensions.ts" />

module PageObjects {
    'use strict';

    export class ActivityPieChart {
        constructor(private EntityName:string) {
            this.ScopeName = 'SummaryChartItem';
        }

        private ScopeName:string;

        public static Count():number {
            return element('div.activityItem').count();
        }

        public CreatedCount():any {
            return this.ReadValueAttributeFrom('createdSeries');
        }

        public UpdatedCount():any {
            return this.ReadValueAttributeFrom('updatedSeries');
        }

        public DeletedCount():any {
            return this.ReadValueAttributeFrom('deletedSeries');
        }

        private ReadValueAttributeFrom(chartPart:string):any {
            var chartItemSelector:string = ('[data-summary-activity-chart="{0}"]').format([this.EntityName]);
            var elementSelector:string = ('g.{0} > path').format([chartPart]);
            return using(chartItemSelector, this.ScopeName).element(elementSelector).attr('ct:value');
        }
    }
}
