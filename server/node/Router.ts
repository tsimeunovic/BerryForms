/// <reference path="../GlobalReferences.ts" />
/// <reference path="../config/Config.ts" />
/// <reference path="../services/IRepositoryFactory.ts" />
/// <reference path="../data/INodeRepository.ts" />

'use strict';

//Modules
import ConfigServer = require('../config/Config');
import ConfigClient = require('../config/ClientConfig');
import NodeRepository = require('../data/NodeRepository');

export module NodeHelpers {
    export class Router {
        private static ReturnJsonResultOf(req:any, res:any, action:(request:any, callback:(data:any, errors:any)=>void)=>void) {
            action(req, function (result, errors) {
                var output = errors ? errors : result;
                var status = errors ? 500 : 200;

                res.status(status);
                output ? res.jsonp(output) : res.send();
            });
        }

        private static ReturnObjectAssignment(req:any, res:any, objectName:string, action:(request:any, callback:(data:any, errors:any)=>void)=>void) {
            action(req, function (result, errors) {
                var output = errors ? errors : result;
                var status = errors ? 500 : 200;

                res.writeHead(status, {'content-type': 'application/javascript'});
                if (errors) {
                }
                else {
                    res.write('\'use strict\';');
                    res.write('var _global = this;');
                    res.write('_global.ServerObjects = _global.ServerObjects || {};');
                    res.write('_global.ServerObjects.' + objectName + ' = ');
                    res.write(JSON.stringify(output));
                    res.write(';');
                }
                res.end();
            });
        }

        public static InitializeRoutes(app:any):void {
            //Api prefix
            var routeBaseUrl = '/' + ConfigServer.Config.Server.ApiPrefix;
            var nodeRepository = new NodeRepository.Data.NodeRepository<any>();
            var clientConfig = ConfigClient.Config.ClientConfig;

            //Special methods
            app.get(routeBaseUrl + '/:type/reducedList', function (req, res) {
                Router.ReturnJsonResultOf(req, res, nodeRepository.GetAllProjected.bind(nodeRepository));
            });
            app.get(routeBaseUrl + '/configuration', function (req, res) {
                Router.ReturnObjectAssignment(req, res, 'ConfigurationOverrides', clientConfig.GetClientConfigurationOverrides);
            });

            //Generic methods
            app.get(routeBaseUrl + '/:type/:name/page/:page/:size', function (req, res) {
                Router.ReturnJsonResultOf(req, res, nodeRepository.GetPaged.bind(nodeRepository));
            });
            app.post(routeBaseUrl + '/:type/:name/filtered/page/:page/:size', function (req, res) {
                Router.ReturnJsonResultOf(req, res, nodeRepository.GetFiltered.bind(nodeRepository));
            });
            app.get(routeBaseUrl + '/:type/:name', function (req, res) {
                Router.ReturnJsonResultOf(req, res, nodeRepository.GetAll.bind(nodeRepository));
            });
            app.get(routeBaseUrl + '/:type/:name/:id', function (req, res) {
                Router.ReturnJsonResultOf(req, res, nodeRepository.GetById.bind(nodeRepository));
            });
            app.post(routeBaseUrl + '/:type/:name', function (req, res) {
                var isNewRecord:boolean = req.body.Id == null;
                isNewRecord ?
                    Router.ReturnJsonResultOf(req, res, nodeRepository.Create.bind(nodeRepository)) :
                    Router.ReturnJsonResultOf(req, res, nodeRepository.Update.bind(nodeRepository));
            });
            app.delete(routeBaseUrl + '/:type/:name/:id', function (req, res) {
                Router.ReturnJsonResultOf(req, res, nodeRepository.Delete.bind(nodeRepository));
            });
        }
    }
}
