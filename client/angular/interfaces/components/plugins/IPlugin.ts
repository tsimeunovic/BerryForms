/// <reference path="../../../models/pluginContextModel.ts" />

'use strict';

//Interface for every plugin component
module Components.Plugin {
    export interface IPlugin<T> {
        PluginName:string;
        IsPluginFor(pluginContext:Models.PluginContext<T>):boolean;
        Execute(pluginContext:Models.PluginContext<T>, callback:(pluginContext:Models.PluginContext<T>)=>void):void;
    }
}
