/// <reference path="../../jasmine.d.ts" />
/// <reference path="../../../client/angular/interfaces/components/plugins/IPlugin.ts" />

module Mocks {
    'use strict';

    export class PluginMock implements Components.Plugin.IPlugin<any> {
        constructor(shouldExecute:boolean, shouldCancel:boolean) {
            this.ShouldExecute = shouldExecute;
            this.ShouldCancel = shouldCancel;
            this.Setup();
        }

        public PluginName:string;

        private ShouldExecute:boolean;
        private ShouldCancel:boolean;

        //Mock members
        public IsPluginFor(pluginContext:Models.PluginContext<any>):boolean {
            return this.ShouldExecute;
        }

        public Execute(pluginContext:Models.PluginContext<any>, callback:(pluginContext:Models.PluginContext<any>) => void):void {
            if (this.ShouldCancel) {
                pluginContext.SetCancellation(this, 'CancelledByMockPlugin');
            }
            callback(pluginContext);
        }

        private Setup():void {
            this.PluginName = 'MockPlugin';
            spyOn(this, 'IsPluginFor').and.callThrough();
            spyOn(this, 'Execute').and.callThrough();
        }
    }
}
