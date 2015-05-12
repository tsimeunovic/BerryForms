/// <reference path="../../jasmine.d.ts" />
/// <reference path="../page-objects/dashboard.ts" />
/// <reference path="../page-objects/leftMenu.ts" />
/// <reference path="../page-objects/activityPieChart.ts" />
/// <reference path="../page-objects/entitySchemaForm.ts" />

'use strict';

describe('Feature: Dashboard', function () {
    it('should have navigation button as uppermost button in menu', function () {
        //Arrange
        PageObjects.EntitySchemaForm.NavigateToCreateWithLogin();

        //Act
        var leftMenu:PageObjects.LeftMenu = PageObjects.LeftMenu.Current();
        leftMenu.ClickNthGlobalIcon(1);

        //Assert
        expect(PageObjects.Browser.CurrentUrl()).toMatch(PageObjects.Dashboard.DashboardUrlPattern);
    });

    describe('summary charts', function () {
        beforeEach(function () {
            PageObjects.Dashboard.NavigateToGlobalDashboardWithLogin();
        });

        it('should have single chart element', function () {
            //Arrange
            //Act
            //Assert
            expect(PageObjects.ActivityPieChart.Count()).toEqual(1);
        });

        it('should have \'First entity\' chart with 17 inserts', function () {
            //Arrange
            var firstEntityChart:PageObjects.ActivityPieChart = new PageObjects.ActivityPieChart('first_entity');

            //Act
            //Assert
            expect(firstEntityChart.CreatedCount()).toEqual('17');
        });
    });
});
