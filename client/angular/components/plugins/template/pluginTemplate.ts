/// <reference path="../../../interfaces/components/plugins/IPlugin.ts" />
/// <reference path="../../../models/core/entityModel.ts" />
/// <reference path="../../../models/core/entityMetadataModel.ts" />
/// <reference path="../../../../static/pluginOperations.ts" />
/// <reference path="../../../../static/pluginDataTypes.ts" />

'use strict';
var _global:any = this;

//Copy this template when developing new plugin
module Components.Plugins {
    //Change <any> to <Models.Entity> or Models.EntityMetadata
    export class PluginTemplate implements Components.Plugin.IPlugin<any> {
        //Set plugin friendly name here
        public PluginName:string = 'PLUGIN_FRIENDLY_NAME';

        public IsPluginFor(pluginContext:Models.PluginContext<any>):boolean {
            //Examine context and determine by data and event if plugin should execute
            return false;
        }

        public Execute(pluginContext:Models.PluginContext<any>, callback:(pluginContext:Models.PluginContext<any>)=>void):void {
            //Modify data and/or cancel operation execution here
        }
    }
}

//Register plugin
_global.Components.Plugins.push(new Components.Plugins.PluginTemplate());
