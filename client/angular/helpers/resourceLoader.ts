/// <reference path="../../extensions/stringExtensions.ts" />
/// <reference path="../../config/config.ts" />

'use strict';
var _global:any = this;

//Loader of http resources (reads them from global object) with optional callback function after finish
module Helpers {
    export class ResourceLoader {
        private static ResourcesToLoad:any = _global.ResourcesToLoad || [];
        private static SetupDone:boolean = false;

        public static LoadRemainingResources(callback:()=>void):void {
            //Load scheduled resources before application starts
            var resourcesCopy:any[] = ResourceLoader.ResourcesToLoad.createCopy();
            for (var i = 0; i < resourcesCopy.length; i++) {
                var resource = resourcesCopy[i];
                var resourceLoadFunction = function (resource:any) {
                    var request = new XMLHttpRequest();
                    request.onreadystatechange = function () {
                        if (request.readyState === 4) {
                            if (request.status === 200) {
                                if (resource.Callback) resource.Callback(request.responseText);
                            }
                            else {
                                console.error(('Could not load resource \'{0}\'').format([resource.Url]));
                            }
                            ResourceLoader.ResourcesToLoad.remove(resource);
                            ResourceLoader.CheckRemainingResources(callback);
                        }
                    };
                    request.open('GET', resource.Url, Config.Client.LoadResourcesAsynchronously);
                    request.send(null);
                };
                resourceLoadFunction(resource);
            }
            ResourceLoader.CheckRemainingResources(callback);
        }

        private static CheckRemainingResources(callback:()=>void):void {
            if (ResourceLoader.ResourcesToLoad.length == 0 && !ResourceLoader.SetupDone) {
                ResourceLoader.SetupDone = true;
                if(callback) callback();
            }
        }
    }
}