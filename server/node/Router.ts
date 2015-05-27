/// <reference path="../GlobalReferences.ts" />
/// <reference path="../config/Config.ts" />
/// <reference path="../services/IRepositoryFactory.ts" />
/// <reference path="../data/entity/IEntityRepository.ts" />
/// <reference path="../security/ISecurityService.ts" />

//Modules
import ConfigServer = require('../config/Config');
import ConfigClient = require('../config/ClientConfig');
import EntityRepository = require('../data/entity/EntityRepository');
import EntityRepositoryContract = require('../data/entity/IEntityRepository');
import DashboardRepository = require('../data/dashboard/DashboardRepository');
import DashboardRepositoryContract = require('../data/dashboard/IDashboardRepository');
import Security = require('../security/SecurityService');
import SecurityServiceContract = require('../security/ISecurityService');

export module NodeHelpers {
    'use strict';

    export class Router {
        private static EntityRepository:EntityRepositoryContract.Data.IEntityRepository<any>;
        private static SecurityService:SecurityServiceContract.Services.ISecurityService;
        private static DashboardRepository:DashboardRepositoryContract.Data.IDashboardRepository;

        public static InitializeRoutes(app:any):void {
            //Api prefix
            var routeBaseUrl:string = '/' + ConfigServer.Config.Server.ApiPrefix;
            var clientConfig:any = ConfigClient.Config.ClientConfig;
            Router.EntityRepository = new EntityRepository.Data.EntityRepository<any>();
            Router.DashboardRepository = new DashboardRepository.Data.DashboardRepository(Router.EntityRepository);
            Router.SecurityService = new Security.Security.SecurityService(Router.EntityRepository);

            //Special methods
            app.get(routeBaseUrl + '/configuration', function (req:any, res:any):void {
                Router.ReturnObjectAssignment(req, res, 'ConfigurationOverrides',
                    clientConfig.GetClientConfigurationOverrides);
            });
            app.post(routeBaseUrl + '/user/login', function (req:any, res:any):void {
                Router.ReturnJsonResultOf(req, res, false,
                    Router.SecurityService.LoginUser.bind(Router.SecurityService));
            });

            //Dashboard methods
            app.get(routeBaseUrl + '/dashboard/activity/summary', function (req:any, res:any):void {
                //Aggregated
                Router.ReturnJsonResultOf(req, res, true,
                    Router.DashboardRepository.GetEntitiesActivitySummary.bind(Router.DashboardRepository));
            });
            app.get(routeBaseUrl + '/dashboard/activity/me', function (req:any, res:any):void {
                //Just by me
                Router.ReturnJsonResultOf(req, res, true,
                    Router.DashboardRepository.GetMyLastActivity.bind(Router.DashboardRepository));
            });
            app.get(routeBaseUrl + '/dashboard/activity/all', function (req:any, res:any):void {
                //By all users
                Router.ReturnJsonResultOf(req, res, true,
                    Router.DashboardRepository.GetLastActivity.bind(Router.DashboardRepository));
            });

            //Entity methods
            app.get(routeBaseUrl + '/:type/reducedList', function (req:any, res:any):void {
                Router.ReturnJsonResultOf(req, res, true,
                    Router.EntityRepository.GetAllProjected.bind(Router.EntityRepository));
            });
            app.get(routeBaseUrl + '/:type/:name/page/:page/:size', function (req:any, res:any):void {
                Router.ReturnJsonResultOf(req, res, true,
                    Router.EntityRepository.GetPaged.bind(Router.EntityRepository));
            });
            app.post(routeBaseUrl + '/:type/:name/filtered/page/:page/:size', function (req:any, res:any):void {
                Router.ReturnJsonResultOf(req, res, true,
                    Router.EntityRepository.GetFiltered.bind(Router.EntityRepository));
            });
            app.get(routeBaseUrl + '/:type/:name', function (req:any, res:any):void {
                Router.ReturnJsonResultOf(req, res, true,
                    Router.EntityRepository.GetAll.bind(Router.EntityRepository));
            });
            app.get(routeBaseUrl + '/:type/:name/:id', function (req:any, res:any):void {
                Router.ReturnJsonResultOf(req, res, true,
                    Router.EntityRepository.GetById.bind(Router.EntityRepository));
            });
            app.post(routeBaseUrl + '/:type/:name', function (req:any, res:any):void {
                var isNewRecord:boolean = req.body.Id == null;
                isNewRecord ?
                    Router.ReturnJsonResultOf(req, res, true, Router.EntityRepository.Create.bind(Router.EntityRepository)) :
                    Router.ReturnJsonResultOf(req, res, true, Router.EntityRepository.Update.bind(Router.EntityRepository));
            });
            app.delete(routeBaseUrl + '/:type/:name/:id', function (req:any, res:any):void {
                Router.ReturnJsonResultOf(req, res, true,
                    Router.EntityRepository.Delete.bind(Router.EntityRepository));
            });
        }

        private static ReturnJsonResultOf(req:any,
                                          res:any,
                                          authenticatedOnly:boolean,
                                          action:(request:any, callback:(data:any, errors:any) => void) => void):void {
            var actionWrapperFn:() => void = function ():void {
                action(req, function (result:any, errors:any[]):void {
                    var output:any = errors ? errors : result;
                    var status:number = errors ? 500 : 200;

                    res.status(status);
                    output ? res.jsonp(output) : res.send();
                });
            };

            //Validate user then invoke action method
            if (authenticatedOnly) {
                Router.SecurityService.ValidateRequest(req, function (valid:boolean, errors:any):void {
                    if (!valid) {
                        res.status(401);
                        res.send();
                    } else {
                        actionWrapperFn();
                    }
                });
            } else {
                actionWrapperFn();
            }
        }

        private static ReturnObjectAssignment(req:any,
                                              res:any,
                                              objectName:string,
                                              action:(request:any, callback:(data:any, errors:any) => void) => void):void {
            action(req, function (result:any, errors:any[]):void {
                var output:any = errors ? errors : result;
                var status:number = errors ? 500 : 200;

                res.writeHead(status, {'content-type': 'application/javascript'});
                if (errors) {
                    //Write nothing to response
                } else {
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
    }
}
