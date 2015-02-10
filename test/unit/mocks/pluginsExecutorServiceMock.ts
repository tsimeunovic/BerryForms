/// <reference path="../../jasmine.d.ts" />
/// <reference path="../mocks/pluginMock.ts" />
/// <reference path="../../../client/angular/interfaces/services/plugins/IPluginsExecutorService.ts" />

'use strict';

module Mocks {
    export class PluginsExecutorServiceMock implements Services.IPluginsExecutorService {
        constructor(cancelOperation:boolean) {
            this.CancelOperation = cancelOperation;
            this.Setup();
        }

        private CancelOperation:boolean;

        private Setup() {
            spyOn(this, 'ExecuteAllPluginsFor').and.callThrough();
        }

        public SetCancellation(cancelOperation:boolean) {
            this.CancelOperation = cancelOperation;
        }

        public ExecuteAllPluginsFor(pluginContext:Models.PluginContext<any>, callback:(pluginContext:Models.PluginContext<any>)=>void):void {
            if (this.CancelOperation) {
                var pluginMock = new Mocks.PluginMock(true, true);
                pluginContext.SetCancellation(pluginMock, 'CancelledByPluginsExecutorServiceMock');
                pluginContext.CancellationPluginErrorModel = 'CancellationErrorModelMock';
            }
            callback(pluginContext);
        }
    }
}
