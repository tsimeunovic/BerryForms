/// <reference path="../GlobalReferences.ts" />
/// <reference path="../config/Config.ts" />
/// <reference path="../services/IRepositoryFactory.ts" />
/// <reference path="../data/entity/IEntityRepository.ts" />
/// <reference path="../security/ISecurityService.ts" />
//Modules
var ConfigServer = require('../config/Config');
var ConfigClient = require('../config/ClientConfig');
var EntityRepository = require('../data/entity/EntityRepository');
var DashboardRepository = require('../data/dashboard/DashboardRepository');
var Security = require('../security/SecurityService');
var NodeHelpers;
(function (NodeHelpers) {
    'use strict';
    var Router = (function () {
        function Router() {
        }
        Router.InitializeRoutes = function (app) {
            //Api prefix
            var routeBaseUrl = '/' + ConfigServer.Config.Server.ApiPrefix;
            var clientConfig = ConfigClient.Config.ClientConfig;
            Router.EntityRepository = new EntityRepository.Data.EntityRepository();
            Router.DashboardRepository = new DashboardRepository.Data.DashboardRepository(Router.EntityRepository);
            Router.SecurityService = new Security.Security.SecurityService(Router.EntityRepository);
            //Special methods
            app.get(routeBaseUrl + '/configuration', function (req, res) {
                Router.ReturnObjectAssignment(req, res, 'ConfigurationOverrides', clientConfig.GetClientConfigurationOverrides);
            });
            app.post(routeBaseUrl + '/user/login', function (req, res) {
                Router.ReturnJsonResultOf(req, res, false, Router.SecurityService.LoginUser.bind(Router.SecurityService));
            });
            //Dashboard methods
            app.get(routeBaseUrl + '/dashboard/activity/summary', function (req, res) {
                //Aggregated
                Router.ReturnJsonResultOf(req, res, true, Router.DashboardRepository.GetEntitiesActivitySummary.bind(Router.DashboardRepository));
            });
            app.get(routeBaseUrl + '/dashboard/activity/me', function (req, res) {
                //Just by me
                Router.ReturnJsonResultOf(req, res, true, Router.DashboardRepository.GetMyLastActivity.bind(Router.DashboardRepository));
            });
            app.get(routeBaseUrl + '/dashboard/activity/all', function (req, res) {
                //By all users
                Router.ReturnJsonResultOf(req, res, true, Router.DashboardRepository.GetLastActivity.bind(Router.DashboardRepository));
            });
            //Entity methods
            app.get(routeBaseUrl + '/:type/reducedList', function (req, res) {
                Router.ReturnJsonResultOf(req, res, true, Router.EntityRepository.GetAllProjected.bind(Router.EntityRepository));
            });
            app.get(routeBaseUrl + '/:type/:name/page/:page/:size', function (req, res) {
                Router.ReturnJsonResultOf(req, res, true, Router.EntityRepository.GetPaged.bind(Router.EntityRepository));
            });
            app.post(routeBaseUrl + '/:type/:name/filtered/page/:page/:size', function (req, res) {
                Router.ReturnJsonResultOf(req, res, true, Router.EntityRepository.GetFiltered.bind(Router.EntityRepository));
            });
            app.get(routeBaseUrl + '/:type/:name', function (req, res) {
                Router.ReturnJsonResultOf(req, res, true, Router.EntityRepository.GetAll.bind(Router.EntityRepository));
            });
            app.get(routeBaseUrl + '/:type/:name/:id', function (req, res) {
                Router.ReturnJsonResultOf(req, res, true, Router.EntityRepository.GetById.bind(Router.EntityRepository));
            });
            app.post(routeBaseUrl + '/:type/:name', function (req, res) {
                var isNewRecord = req.body.Id == null;
                isNewRecord ?
                    Router.ReturnJsonResultOf(req, res, true, Router.EntityRepository.Create.bind(Router.EntityRepository)) :
                    Router.ReturnJsonResultOf(req, res, true, Router.EntityRepository.Update.bind(Router.EntityRepository));
            });
            app.delete(routeBaseUrl + '/:type/:name/:id', function (req, res) {
                Router.ReturnJsonResultOf(req, res, true, Router.EntityRepository.Delete.bind(Router.EntityRepository));
            });
        };
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
                    else {
                        actionWrapperFn();
                    }
                });
            }
            else {
                actionWrapperFn();
            }
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
        return Router;
    })();
    NodeHelpers.Router = Router;
})(NodeHelpers = exports.NodeHelpers || (exports.NodeHelpers = {}));
//# sourceMappingURL=Router.js.map