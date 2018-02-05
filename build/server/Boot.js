"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

require("./utils/acl.js");

require("./utils/cache.js");

require("./utils/config.js");

require("./utils/console.js");

require("./utils/controller.js");

require("./utils/Database.js");

require("./utils/math.js");

require("./utils/policy.js");

require("./utils/response.js");

require("./utils/service.js");

require("./utils/storage.js");

var _Database = require("./utils/Database");

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _compression = require("compression");

var _compression2 = _interopRequireDefault(_compression);

var _expressFileupload = require("express-fileupload");

var _expressFileupload2 = _interopRequireDefault(_expressFileupload);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

require("./policies/ACLPolicy.js");

require("./policies/AuthPolicy.js");

require("./policies/GeoPolicy.js");

require("./controllers/AuthController.js");

require("./controllers/CDNController.js");

require("./controllers/CurrenciesController.js");

require("./controllers/DashboardController.js");

require("./controllers/FAQController.js");

require("./controllers/MailController.js");

require("./controllers/MarketAlertsController.js");

require("./controllers/MentionsController.js");

require("./controllers/NotificationsController.js");

require("./controllers/NotificationTrackerController.js");

require("./controllers/SourcesController.js");

require("./controllers/StatsController.js");

require("./controllers/SubscriptionController.js");

require("./controllers/TestController.js");

require("./controllers/TicketsController.js");

require("./controllers/TrackersController.js");

require("./controllers/UserController.js");

require("./controllers/AdminPanel/AdminController.js");

require("./controllers/AdminPanel/GroupsController.js");

require("./controllers/AdminPanel/TrackingController.js");

require("./controllers/AdminPanel/UsersController.js");

require("./controllers/Currencies/CurrencyAlertsController.js");

require("./controllers/Portfolio/PortfolioController.js");

require("./services/AuthService.js");

require("./services/CacheService.js");

require("./services/ChartifyService.js");

require("./services/CronService.js");

require("./services/LogService.js");

require("./services/MailService.js");

require("./services/MarketService.js");

require("./services/NotificationService.js");

require("./services/PaymentService.js");

require("./services/RecaptchaService.js");

require("./services/SubscriptionService.js");

require("./services/TrackerService.js");

require("./services/UserQuotaService.js");

require("./responses/accessDenied.js");

require("./responses/error.js");

require("./responses/notFound.js");

require("./responses/serverError.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Create WebServer
// Require Core modules
global.app = (0, _express2.default)();
global.server = _http2.default.Server(app);

// Platform Process Title
process.title = "NKR.Express.App";

console.log("######################");
console.log("#                    #");
console.log("#   Starting Server  #");
console.log("#                    #");
console.log("######################");

// parse application/x-www-form-urlencoded
app.use((0, _compression2.default)({}));
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use((0, _cookieParser2.default)());
app.use((0, _expressFileupload2.default)());
app.use((0, _cors2.default)(Config.cors));
app.appDir = _path2.default.dirname(require.main.filename);

// app.use((req, res, next) => {
// 	let delay = Math.floor((Math.random() * 400) + 100);
// 	console.log("Delaying request:", req.path, "[", delay, "ms ]");
// 	setTimeout(next, delay);
// });
//app.options("192.168.0.101", cors());

for (var element in Config) {
	if (Config[element].register) {
		Config[element].register(app);
	}
}

// parse application/json
app.use(_bodyParser2.default.json());

// Import Application Modules


// Assets directory
Config.express.statics.forEach(function (staticDir) {
	app.use(_express2.default.static(staticDir));
});

var minify = require('html-minifier').minify;
app.set('json spaces', 2);

// Set a shortcut to detect xhttp requests
app.use(function (req, res, next) {
	if (!req || !req.headers || !req.headers.accept) {
		req.isAjax = true;
		next();
		return;
	}

	req.isAjax = req.xhr || req.headers.accept.indexOf('json') > -1;
	next();
});

// set up Respones and error handlers
for (var response in __Responses) {
	__Responses[response].__register(app);
}

// Register policies
for (var policy in Policies) {
	if (Policies[policy].register) {
		Policies[policy].register(app);
	}
}

for (var _iterator = Config.middlewares, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
	var _ref;

	if (_isArray) {
		if (_i >= _iterator.length) break;
		_ref = _iterator[_i++];
	} else {
		_i = _iterator.next();
		if (_i.done) break;
		_ref = _i.value;
	}

	var middleware = _ref;

	app.use(middleware);
}

// Apply global policies
for (var _iterator2 = Config.policies, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);;) {
	var _ref2;

	if (_isArray2) {
		if (_i2 >= _iterator2.length) break;
		_ref2 = _iterator2[_i2++];
	} else {
		_i2 = _iterator2.next();
		if (_i2.done) break;
		_ref2 = _i2.value;
	}

	var policy = _ref2;

	if (Policies[policy].route) app.use(Policies[policy].route);
}

// Then finally.. Hook up the controllers.
for (var _iterator3 = Controllers, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : (0, _getIterator3.default)(_iterator3);;) {
	var _ref3;

	if (_isArray3) {
		if (_i3 >= _iterator3.length) break;
		_ref3 = _iterator3[_i3++];
	} else {
		_i3 = _iterator3.next();
		if (_i3.done) break;
		_ref3 = _i3.value;
	}

	var controller = _ref3;

	controller.__register(app);
}

var db = new _Database.Database(Config.Database);
db.init();

server.listen(Config.express.listen, function () {
	console.log("Application listening on:", Config.express.listen);

	// database.Database = new Database(Config.Model);
	// database(function()
	// {
	// 	console.log("Up and running!");
	// })
});

app.use(function (req, res, next) {
	res.notFound();
	next();
});

// Error handler
app.use(function (error, req, res, next) {
	res.serverError(error);
	//res.status(500).send({ success: false, message: 'Something failed!' })
});