/// <reference path="../core/entityModel.ts" />
/// <reference path="../core/entityMetadataModel.ts" />
/// <reference path="../../interfaces/components/plugins/IPlugin.ts" />
/// <reference path="../../../static/pluginDataTypes.ts" />

//Model of plugin execution context
module Models {
    'use strict';

    export class PluginContext<T> {
        constructor(data:T, dataType:string, operationType:string) {
            this.Data = data;
            this.DataType = dataType;
            this.OperationType = operationType;
            this.CancelPluginOperation = false;
            this.PluginsExecutedCount = 0;
        }

        public Data:T;
        public DataType:string;
        public OperationType:string;

        public PluginsExecutedCount:number;

        public CancelPluginOperation:boolean;
        public CancellationMessage:string;
        public CancellationPlugin:Components.Plugin.IPlugin<T>;
        public CancellationPluginErrorModel:any;

        public static CreateForEntity(data:Models.Entity, operationType:string):PluginContext<Models.Entity> {
            return new PluginContext<Models.Entity>(data, Static.PluginDataType.Entity, operationType);
        }

        public static CreateForMetadata(data:Models.EntityMetadata, operationType:string):PluginContext<Models.EntityMetadata> {
            return new PluginContext<Models.EntityMetadata>(data, Static.PluginDataType.Metadata, operationType);
        }

        public SetCancellation(cancellationPlugin:Components.Plugin.IPlugin<T>, cancellationMessage:string):void {
            if (this.CancelPluginOperation) {
                throw new Error();
            }
            this.CancelPluginOperation = true;
            this.CancellationPlugin = cancellationPlugin;
            this.CancellationMessage = cancellationMessage;
        }
    }
}
