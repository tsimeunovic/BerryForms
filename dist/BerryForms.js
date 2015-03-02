/// <reference path="./server/config/Config.ts" />
/// <reference path="./server/node/Cors.ts" />
/// <reference path="./server/node/Router.ts" />
//Modules
var Router = require('./server/node/Router');
var ConfigServer = require('./server/config/Config');
var Cors = require('./server/node/Cors');
var Bootstrap = require('./server/node/Bootstrap');
var ProcessStarted = require('./server/node/ProcessStarter');
var Express = require('express');
var Compress = require('compression');
var BodyParser = require('body-parser');
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
App.use('/', Express.static(__dirname + '/client/', { maxage: 365 * 86400 * 1000 }));
App.use('/bower_components/', Express.static(__dirname + '/bower_components/')); //Just for dev
//Start server
App.listen(ConfigServer.Config.Server.NodePort);
console.log('Listening on port ' + ConfigServer.Config.Server.NodePort + ' ...');
//# sourceMappingURL=BerryForms.js.map