/// <reference path="../core/entityModel.ts" />
/// <reference path="../core/entityMetadataModel.ts" />
/// <reference path="../security/userSessionModel.ts" />
/// <reference path="../../interfaces/components/plugins/IPlugin.ts" />
/// <reference path="../../../static/pluginDataTypes.ts" />

//Model of plugin execution context
module Models {
    'use strict';

    export class PluginContext<T> {
        constructor(data:T, dataType:string, operationType:string, operationCanBeCancelled:boolean) {
            this.Data = data;
            this.DataType = dataType;
            this.OperationType = operationType;
            this.OperationCanBeCancelled = operationCanBeCancelled;
            this.CancelPluginOperation = false;
            this.PluginsExecutedCount = 0;
        }

        //Plugin operation
        public Data:T;
        public DataType:string;
        public OperationType:string;
        public OperationCanBeCancelled:boolean;

        //Plugin execution
        public PluginsExecutedCount:number;

        //Plugin cancellation
        public CancelPluginOperation:boolean;
        public CancellationMessage:string;
        public CancellationPlugin:Components.Plugin.IPlugin<T>;
        public CancellationPluginErrorModel:any;

        public static CreateForEntity(data:Models.Entity, operationType:string):PluginContext<Models.Entity> {
            return new PluginContext<Models.Entity>(data, Static.PluginDataType.Entity, operationType, true);
        }

        public static CreateForMetadata(data:Models.EntityMetadata, operationType:string):PluginContext<Models.EntityMetadata> {
            return new PluginContext<Models.EntityMetadata>(data, Static.PluginDataType.Metadata, operationType, true);
        }

        public static CreateForSession(data:Models.UserSession, operationType:string):PluginContext<Models.UserSession> {
            return new PluginContext<Models.UserSession>(data, Static.PluginDataType.UserSession, operationType, false);
        }

        public SetCancellation(cancellationPlugin:Components.Plugin.IPlugin<T>, cancellationMessage:string):void {
            if (this.CancelPluginOperation || !this.OperationCanBeCancelled) {
                throw new Error('Tried to cancel operation that cannot be cancelled');
            }

            this.CancelPluginOperation = true;
            this.CancellationPlugin = cancellationPlugin;
            this.CancellationMessage = cancellationMessage;
        }
    }
}
