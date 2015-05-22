/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../../../client/angular/services/localization/localizationService.ts" />

'use strict';
var _global:any = this;

describe('Service: LocalizationService', function ():void {
    var systemUnderTest:Services.LocalizationService;
    var originalResources:Localization.IResources;

    beforeEach(function ():void {
        originalResources = _global.Localization.Resources;
    });

    afterEach(function ():void {
        _global.Localization.Resources = originalResources;
    });

    it('should read registered resources object from global variable and use it as resource object', function ():void {
        //Arrange
        var resourcesObj:any = {a: 'a', b: 'b'};
        _global.Localization.Resources = resourcesObj;

        //Act
        systemUnderTest = new Services.LocalizationService();

        //Assert
        expect(systemUnderTest.Resources).toBe(resourcesObj);
        expect(systemUnderTest.GetResourceByKey('a', null)).toEqual('a');
        expect(Services.LocalizationService.Resources).toBe(resourcesObj);
    });
});
