/// <reference path="../../interfaces/services/plugins/IPluginsExecutorService.ts" />
/// <reference path="../../interfaces/services/interaction/INotificationService.ts" />
/// <reference path="../../interfaces/services/localization/ILocalizationService.ts" />
/// <reference path="../../interfaces/components/plugins/IPlugin.ts" />
/// <reference path="../../../extensions/stringExtensions.ts" />

var _global:any = this;
_global.Components = _global.Components || {};
_global.Components.Plugins = [];

//Service that executes registered plugins for specific operation
module Services {
    'use strict';

    export class PluginsExecutorService implements Services.IPluginsExecutorService {
        /* tslint:disable:member-ordering */
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

        public ExecuteAllPluginsFor(pluginContext:Models.PluginContext<any>, callback:(pluginContext:Models.PluginContext<any>) => void):void {
            var _this:PluginsExecutorService = this;

            //Check registered plugins existence
            if (!this.RegisteredPlugins || !this.RegisteredPlugins.length) {
                callback(pluginContext);
                return;
            }

            //Get array of plugins that should execute
            var allPluginsCopy:Components.Plugin.IPlugin<any>[] = this.RegisteredPlugins.createCopy();
            var executablePluginPredicate:(p:Components.Plugin.IPlugin<any>) => boolean = function (plugin:Components.Plugin.IPlugin<any>):boolean {
                return plugin.IsPluginFor(pluginContext);
            };
            var pluginsToExecute:Components.Plugin.IPlugin<any>[] = allPluginsCopy.where(executablePluginPredicate);

            //Wrapped callback with handled cancellation handling
            var wrappedCallback:(pc:Models.PluginContext<any>) => void = function (pluginContext:Models.PluginContext<any>):void {
                if (pluginContext.CancelPluginOperation) {
                    pluginContext.CancellationPluginErrorModel = _this.CreatePluginCancellationErrorModel(pluginContext);
                }
                callback(pluginContext);
            };

            //Execute function and callback factory
            var createExecutePluginFunctionWithCallback:(i:number) => (pc:Models.PluginContext<any>) => void =
                function (pluginIndex:number):(pluginContext:Models.PluginContext<any>) => void {
                    return function (pluginContext:Models.PluginContext<any>):void {
                        if (!pluginsToExecute || pluginIndex >= pluginsToExecute.length || pluginContext.CancelPluginOperation) {
                            wrappedCallback(pluginContext);
                        } else {
                            var currentPlugin:Components.Plugin.IPlugin<any> = pluginsToExecute[pluginIndex];
                            var nextCallback:(pc:Models.PluginContext<any>) => void = createExecutePluginFunctionWithCallback(pluginIndex + 1);
                            currentPlugin.Execute(pluginContext, nextCallback);
                        }
                    };
                };

            //Execute
            var startingFunction:(pluginContext:Models.PluginContext<any>) => void = createExecutePluginFunctionWithCallback(0);
            startingFunction(pluginContext);
        }

        private CreatePluginCancellationErrorModel(pluginContext:Models.PluginContext<any>):any {
            var cancellationPluginName:string =
                (pluginContext.CancellationPlugin && pluginContext.CancellationPlugin.PluginName) ||
                this.LocalizationService.Resources.UnknownPlugin;

            var pluginMessage:string = pluginContext.CancellationMessage;
            var message:string = pluginMessage ?
                this.LocalizationService.Resources.OperationCancelledByPluginWithMessage.format([cancellationPluginName, pluginMessage]) :
                this.LocalizationService.Resources.OperationCancelledByPlugin.format([cancellationPluginName]);

            return {
                Type: 'Plugin',
                PluginMessage: message
            };
        }
    }
}
