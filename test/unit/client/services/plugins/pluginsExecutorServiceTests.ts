/// <reference path="../../../../jasmine.d.ts" />
/// <reference path="../../../mocks/localizationServiceMock.ts" />
/// <reference path="../../../mocks/callbackMock.ts" />
/// <reference path="../../../mocks/pluginMock.ts" />
/// <reference path="../../../../../client/angular/services/plugins/pluginsExecutorService.ts" />

'use strict';
var _global:any = this;

describe('Service: PluginsExecutorService', function ():void {
    var systemUnderTest:Services.PluginsExecutorService;
    var localizationServiceMock:Services.ILocalizationService;
    var registeredPlugins:Components.Plugin.IPlugin<any>[];

    beforeEach(function ():void {
        registeredPlugins = [
            new Mocks.PluginMock(true, false), //Execute and proceed
            new Mocks.PluginMock(false, false), //Don't execute
            new Mocks.PluginMock(false, false), //Don't execute
            new Mocks.PluginMock(true, true), //Execute and cancel
            new Mocks.PluginMock(true, true), //Will not execute because previous was cancelled
        ];
        _global.Components.Plugins = registeredPlugins;
        localizationServiceMock = new Mocks.LocalizationServiceMock();

        systemUnderTest = new Services.PluginsExecutorService(localizationServiceMock);
    });

    it('should execute all registered plugins and return correct cancellation status', function ():void {
        //Arrange
        var pluginData:any = {};
        var pluginContext:Models.PluginContext<any> = new Models.PluginContext(pluginData, 'MockData', 'MockOperation');
        var callback:any = new Mocks.CallbackMock();

        //Act
        systemUnderTest.ExecuteAllPluginsFor(pluginContext, callback.callback);

        //Assert
        expect(callback.callback.calls.any()).toEqual(true);
        var firstPluginShouldExecuteMethodMock:any = registeredPlugins[0].IsPluginFor;
        expect(firstPluginShouldExecuteMethodMock.calls.any()).toEqual(true);
        var lastPluginShouldExecuteMethodMock:any = registeredPlugins[4].IsPluginFor;
        expect(lastPluginShouldExecuteMethodMock.calls.any()).toEqual(true);
        var firstPluginExecuteMethodMock:any = registeredPlugins[0].Execute;
        expect(firstPluginExecuteMethodMock.calls.any()).toEqual(true);
        expect(firstPluginExecuteMethodMock.calls.first().args[0]).toBe(pluginContext);
        var lastPluginExecuteMethodMock:any = registeredPlugins[4].Execute;
        expect(lastPluginExecuteMethodMock.calls.any()).toEqual(false);
        expect(pluginContext.CancelPluginOperation).toEqual(true);
        expect(pluginContext.CancellationPlugin).toBe(registeredPlugins[3]);
    });
});
