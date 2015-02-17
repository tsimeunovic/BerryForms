/// <reference path="../GlobalReferences.ts" />
/// <reference path="../config/Config.ts" />
/// <reference path="../services/IRepositoryFactory.ts" />
/// <reference path="../data/INodeRepository.ts" />
/// <reference path="../security/ISecurityService.ts" />
'use strict';
//Modules
var ConfigServer = require('../config/Config');
var ConfigClient = require('../config/ClientConfig');
var NodeRepository = require('../data/NodeRepository');
var Security = require('../security/SecurityService');
var NodeHelpers;
(function (NodeHelpers) {
    var Router = (function () {
        function Router() {
        }
        Router.ReturnJsonResultOf = function (req, res, authenticatedOnly, action) {
            var actionWrapperFn = function () {
                action(req, function (result, errors) {
                    var output = errors ? errors : result;
                    var status = errors ? 500 : 200;
                    res.status(status);
                    output ? res.jsonp(output) : res.send();
                });
            };
            //Validate user then invoke action method
            if (authenticatedOnly) {
                Router.SecurityService.ValidateRequest(req, function (valid, errors) {
                    if (!valid) {
                        res.status(401);
                        res.send();
                    }
                    else
                        actionWrapperFn();
                });
            }
            else
                actionWrapperFn();
        };
        Router.ReturnObjectAssignment = function (req, res, objectName, action) {
            action(req, function (result, errors) {
                var output = errors ? errors : result;
                var status = errors ? 500 : 200;
                res.writeHead(status, { 'content-type': 'application/javascript' });
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
        };
        Router.InitializeRoutes = function (app) {
            //Api prefix
            var routeBaseUrl = '/' + ConfigServer.Config.Server.ApiPrefix;
            var clientConfig = ConfigClient.Config.ClientConfig;
            Router.NodeRepository = new NodeRepository.Data.NodeRepository();
            Router.SecurityService = new Security.Security.SecurityService(Router.NodeRepository);
            //Special methods
            app.get(routeBaseUrl + '/:type/reducedList', function (req, res) {
                Router.ReturnJsonResultOf(req, res, true, Router.NodeRepository.GetAllProjected.bind(Router.NodeRepository));
            });
            app.get(routeBaseUrl + '/configuration', function (req, res) {
                Router.ReturnObjectAssignment(req, res, 'ConfigurationOverrides', clientConfig.GetClientConfigurationOverrides);
            });
            app.post(routeBaseUrl + '/user/login', function (req, res) {
                Router.ReturnJsonResultOf(req, res, false, Router.SecurityService.LoginUser.bind(Router.SecurityService));
            });
            //Generic methods
            app.get(routeBaseUrl + '/:type/:name/page/:page/:size', function (req, res) {
                Router.ReturnJsonResultOf(req, res, true, Router.NodeRepository.GetPaged.bind(Router.NodeRepository));
            });
            app.post(routeBaseUrl + '/:type/:name/filtered/page/:page/:size', function (req, res) {
                Router.ReturnJsonResultOf(req, res, true, Router.NodeRepository.GetFiltered.bind(Router.NodeRepository));
            });
            app.get(routeBaseUrl + '/:type/:name', function (req, res) {
                Router.ReturnJsonResultOf(req, res, true, Router.NodeRepository.GetAll.bind(Router.NodeRepository));
            });
            app.get(routeBaseUrl + '/:type/:name/:id', function (req, res) {
                Router.ReturnJsonResultOf(req, res, true, Router.NodeRepository.GetById.bind(Router.NodeRepository));
            });
            app.post(routeBaseUrl + '/:type/:name', function (req, res) {
                var isNewRecord = req.body.Id == null;
                isNewRecord ? Router.ReturnJsonResultOf(req, res, true, Router.NodeRepository.Create.bind(Router.NodeRepository)) : Router.ReturnJsonResultOf(req, res, true, Router.NodeRepository.Update.bind(Router.NodeRepository));
            });
            app.delete(routeBaseUrl + '/:type/:name/:id', function (req, res) {
                Router.ReturnJsonResultOf(req, res, true, Router.NodeRepository.Delete.bind(Router.NodeRepository));
            });
        };
        return Router;
    })();
    NodeHelpers.Router = Router;
})(NodeHelpers = exports.NodeHelpers || (exports.NodeHelpers = {}));
//# sourceMappingURL=Router.js.map