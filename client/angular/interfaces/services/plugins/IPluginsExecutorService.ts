/// <reference path="../../../models/plugins/pluginContextModel.ts" />

'use strict';

//Interface for Plugin executor service (executes all registered plugin for plugin related operations)
module Services {
    export interface IPluginsExecutorService {
        ExecuteAllPluginsFor(pluginContext:Models.PluginContext<any>, callback:(pluginContext:Models.PluginContext<any>)=>void):void;
    }
}

