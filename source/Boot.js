// Require Core modules
import "glob:utils/*.js";
import { Database } from "./utils/Database";

import express from "express";
import bodyParser from 'body-parser';
import compression from 'compression';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import http from "http";
import cors from 'cors';
import path from 'path';

// Create WebServer
global.app = express();
global.server = http.Server(app);

// Platform Process Title
process.title = "NKR.Express.App";

console.log("######################");
console.log("#                    #");
console.log("#   Starting Server  #");
console.log("#                    #");
console.log("######################");


// parse application/x-www-form-urlencoded
app.use(compression({}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(fileUpload());
app.use(cors(Config.cors));
app.appDir = path.dirname(require.main.filename);

// app.use((req, res, next) => {
// 	let delay = Math.floor((Math.random() * 400) + 100);
// 	console.log("Delaying request:", req.path, "[", delay, "ms ]");
// 	setTimeout(next, delay);
// });
//app.options("192.168.0.101", cors());

for(var element in Config)
{
	if(Config[element].register)
	{
		Config[element].register(app);
	}
}

// parse application/json
app.use(bodyParser.json());

// Import Application Modules
import "glob:policies/*Policy.js";
import "glob:controllers/**Controller.js";
import "glob:controllers/*/*Controller.js";
import "glob:controllers/*/*/*Controller.js";
import "glob:services/*Service.js";
import "glob:responses/*.js";

// Assets directory
Config.express.statics.forEach(function(staticDir)
{
	app.use(express.static(staticDir));
})

var minify = require('html-minifier').minify;
app.set('json spaces', 2);

// Set a shortcut to detect xhttp requests
app.use(function(req, res, next)
{
	if(!req || !req.headers || !req.headers.accept)
	{
		req.isAjax = true;
		next();
		return;
	}
	
	req.isAjax = req.xhr || req.headers.accept.indexOf('json') > -1;
	next();
});

// set up Respones and error handlers
for(var response in __Responses)
{
	__Responses[response].__register(app);
}


// Register policies
for(var policy in Policies)
{
	if(Policies[policy].register)
	{
		Policies[policy].register(app);
	}
}

for(var middleware of Config.middlewares)
{
	app.use(middleware);
}

// Apply global policies
for(var policy of Config.policies)
{
	if(Policies[policy].route)
		app.use(Policies[policy].route);
}

// Then finally.. Hook up the controllers.
for(var controller of Controllers)
{
	controller.__register(app);
}


let db = new Database(Config.Database);
db.init();

server.listen(Config.express.listen, function()
{
	console.log("Application listening on:", Config.express.listen);

	
		

	


	// database.Database = new Database(Config.Model);
	// database(function()
	// {
	// 	console.log("Up and running!");
	// })
});

app.use(function(req, res, next)
{
	res.notFound();
	next();
});

// Error handler
app.use((error, req, res, next) => {
	res.serverError(error);
	//res.status(500).send({ success: false, message: 'Something failed!' })
});
