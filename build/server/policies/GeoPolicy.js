"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var geoip = require("geoip-lite");
var requestIp = require('request-ip');

var GeoPolicy = (_dec = Policy("Geo"), _dec(_class = function () {
	function GeoPolicy() {
		(0, _classCallCheck3.default)(this, GeoPolicy);
	}

	GeoPolicy.prototype.register = function register(app) {
		console.log("[GEO] Register");
		app.use(requestIp.mw());
	};

	GeoPolicy.prototype.route = function route(req, res, next) {
		var geo = geoip.lookup(req.clientIp);
		req.geoip = geo;
		return next();
	};

	return GeoPolicy;
}()) || _class);
;