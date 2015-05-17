/// <reference path="../../../models/plugins/pluginContextModel.ts" />

//Interface for every plugin component
module Components.Plugin {
    'use strict';

    export interface IPlugin<T> {
        PluginName:string;
        IsPluginFor(pluginContext:Models.PluginContext<T>):boolean;
        Execute(pluginContext:Models.PluginContext<T>, callback:(pluginContext:Models.PluginContext<T>) => void):void;
    }
}
