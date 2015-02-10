/// <reference path="../../interfaces/services/plugins/IPluginsExecutorService.ts" />
/// <reference path="../../interfaces/services/interaction/INotificationService.ts" />
/// <reference path="../../interfaces/components/plugins/IPlugin.ts" />
/// <reference path="../../../extensions/stringExtensions.ts" />

'use strict';

var _global:any = this;
_global.Components = _global.Components || {};
_global.Components.Plugins = [];

//Service that executes registered plugins for specific operation
module Services {
    export class PluginsExecutorService implements Services.IPluginsExecutorService {
        public static injection():any[] {
            return [
                'LocalizationService',
                PluginsExecutorService
            ];
        }

        constructor(private LocalizationService:Services.ILocalizationService) {
            this.RegisteredPlugins = _global.Components.Plugins;
        }

        private RegisteredPlugins:Components.Plugin.IPlugin<any>[];

        public ExecuteAllPluginsFor(pluginContext:Models.PluginContext<any>, callback:(pluginContext:Models.PluginContext<any>)=>void):void {
            var _this = this;

            //Check registered plugins existence
            if (!this.RegisteredPlugins || !this.RegisteredPlugins.length) {
                callback(pluginContext);
                return;
            }

            //Get array of plugins that should execute
            var allPluginsCopy = this.RegisteredPlugins.createCopy();
            var executablePluginPredicate = function (plugin:Components.Plugin.IPlugin<any>) {
                return plugin.IsPluginFor(pluginContext);
            };
            var pluginsToExecute:Components.Plugin.IPlugin<any>[] = allPluginsCopy.where(executablePluginPredicate);

            //Wrapped callback with handled cancellation handling
            var wrappedCallback = function (pluginContext:Models.PluginContext<any>):void {
                if (pluginContext.CancelPluginOperation) pluginContext.CancellationPluginErrorModel = _this.CreatePluginCancellationErrorModel(pluginContext);
                callback(pluginContext);
            };

            //Execute function and callback factory
            var createExecutePluginFunctionWithCallback = function (pluginIndex):(pluginContext:Models.PluginContext<any>)=>void {
                return function (pluginContext:Models.PluginContext<any>):void {
                    if (!pluginsToExecute || pluginIndex >= pluginsToExecute.length || pluginContext.CancelPluginOperation) {
                        wrappedCallback(pluginContext);
                    }
                    else {
                        var currentPlugin:Components.Plugin.IPlugin<any> = pluginsToExecute[pluginIndex];
                        var nextCallback = createExecutePluginFunctionWithCallback(pluginIndex + 1);
                        currentPlugin.Execute(pluginContext, nextCallback);
                    }
                };
            };

            //Execute
            var startingFunction:(pluginContext:Models.PluginContext<any>)=>void = createExecutePluginFunctionWithCallback(0);
            startingFunction(pluginContext);
        }

        private CreatePluginCancellationErrorModel(pluginContext:Models.PluginContext<any>):any {
            var cancellationPluginName = (pluginContext.CancellationPlugin && pluginContext.CancellationPlugin.PluginName) || this.LocalizationService.Resources.UnknownPlugin;
            var pluginMessage = pluginContext.CancellationMessage;
            var message = pluginMessage ?
                this.LocalizationService.Resources.OperationCancelledByPluginWithMessage.format([cancellationPluginName, pluginMessage]) :
                this.LocalizationService.Resources.OperationCancelledByPlugin.format([cancellationPluginName]);

            return {
                Type: 'Plugin',
                PluginMessage: message
            };
        }
    }
}
