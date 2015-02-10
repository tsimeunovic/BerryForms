/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/components/plugins/IPlugin.ts" />

'use strict';

module Mocks {
    export class PluginMock implements Components.Plugin.IPlugin<any> {
        constructor(shouldExecute:boolean, shouldCancel:boolean) {
            this.ShouldExecute = shouldExecute;
            this.ShouldCancel = shouldCancel;
            this.Setup();
        }

        private ShouldExecute:boolean;
        private ShouldCancel:boolean;

        private Setup():void {
            this.PluginName = 'MockPlugin';
            spyOn(this, 'IsPluginFor').and.callThrough();
            spyOn(this, 'Execute').and.callThrough();
        }

        //Mock members
        public PluginName:string;

        public IsPluginFor(pluginContext:Models.PluginContext<any>):boolean {
            return this.ShouldExecute;
        }

        public Execute(pluginContext:Models.PluginContext<any>, callback:(pluginContext:Models.PluginContext<any>)=>void):void {
            if (this.ShouldCancel) pluginContext.SetCancellation(this, 'CancelledByMockPlugin');
            callback(pluginContext);
        }
    }
}
