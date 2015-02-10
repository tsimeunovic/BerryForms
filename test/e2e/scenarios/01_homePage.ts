/// <reference path="../../jasmine.d.ts" />
/// <reference path="../page-objects/homePage.ts" />
/// <reference path="../page-objects/entitySchemaForm.ts" />

'use strict';

describe('Feature: Home screen', function () {
    beforeEach(function () {
        PageObjects.HomePage.NavigateTo();
    });

    it('should display form for creating new entity', function () {
        //Arrange
        //Act

        //Assert
        expect(PageObjects.Browser.CurrentUrl()).toMatch(PageObjects.EntitySchemaForm.CreateEntityUrlPattern);
    });
});
