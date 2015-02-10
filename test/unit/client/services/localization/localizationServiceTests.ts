/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../../../client/angular/services/localization/localizationService.ts" />

'use strict';
var _global:any = this;

describe('Service: LocalizationService', function () {
    var systemUnderTest:Services.LocalizationService;
    var originalResources;

    beforeEach(function () {
        originalResources = _global.Localization.Resources;
    });

    afterEach(function () {
        _global.Localization.Resources = originalResources;
    });

    it('should read registered resources object from global variable and use it as resource object', function () {
        //Arrange
        var resourcesObj = {a: 'a', b: 'b'};
        _global.Localization.Resources = resourcesObj;

        //Act
        systemUnderTest = new Services.LocalizationService();

        //Assert
        expect(systemUnderTest.Resources).toBe(resourcesObj);
        expect(systemUnderTest.GetResourceByKey('a', null)).toEqual('a');
        expect(Services.LocalizationService.Resources).toBe(resourcesObj);
    });
});
