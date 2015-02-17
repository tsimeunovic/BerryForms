/// <reference path="./server/config/Config.ts" />
/// <reference path="./server/node/Cors.ts" />
/// <reference path="./server/node/Router.ts" />

//Node variables
declare var __dirname:string;

//Modules
import Router = require('./server/node/Router');
import ConfigServer = require('./server/config/Config');
import Cors = require('./server/node/Cors');
import Bootstrap = require('./server/node/Bootstrap');
import ProcessStarted = require('./server/node/ProcessStarter');
var Express:any = require('express');
var Compress:any = require('compression');
var BodyParser:any = require('body-parser');

//Configure server and allow CORS
Bootstrap.NodeHelpers.Bootstrap.Setup();
var App = Express();
App.use(Compress());
App.use(BodyParser.urlencoded({ extended: true }));
App.use(BodyParser.json());
Cors.NodeHelpers.Cors.EnableCorsOnExpress(App);

//Process settings
ProcessStarted.NodeHelpers.ProcessStarter.ApplyProcessParameters(process);

//Api routes
Router.NodeHelpers.Router.InitializeRoutes(App);

//Static content
App.use('/', Express.static(__dirname + '/client/'));
App.use('/bower_components/', Express.static(__dirname + '/bower_components/')); //Just for dev

//Start server
App.listen(ConfigServer.Config.Server.NodePort);
console.log('Listening on port ' + ConfigServer.Config.Server.NodePort + ' ...');
