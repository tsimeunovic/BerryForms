/// <reference path="../../../interfaces/components/plugins/IPlugin.ts" />
/// <reference path="../../../models/core/entityModel.ts" />
/// <reference path="../../../models/core/entityMetadataModel.ts" />
/// <reference path="../../../../static/pluginOperations.ts" />
/// <reference path="../../../../static/pluginDataTypes.ts" />

'use strict';
var _global:any = this;

//Example of working plugin - upon creation of new entity type it checks if Description is filled and if not, it cancels the operation
module Components.Plugins {
    export class PluginExample implements Components.Plugin.IPlugin<Models.EntityMetadata> {
        public PluginName:string = 'Example Plugin';

        public IsPluginFor(pluginContext:Models.PluginContext<Models.EntityMetadata>):boolean {
            return pluginContext.DataType == Static.PluginDataType.Metadata &&
                pluginContext.OperationType == Static.PluginOperation.Create;
        }

        public Execute(pluginContext:Models.PluginContext<Models.EntityMetadata>, callback:(pluginContext:Models.PluginContext<Models.EntityMetadata>)=>void):void {
            //Force description to be filled
            var description:string = pluginContext.Data && pluginContext.Data.EntityDescription;
            var descriptionFilled:boolean = description != null && description.length > 0;

            if(!descriptionFilled) {
                //Cancel execution
                pluginContext.SetCancellation(this, 'Description field has to be filled');
            }
            callback(pluginContext);
        }
    }
}

//Register plugin
_global.Components.Plugins.push(new Components.Plugins.PluginExample());
