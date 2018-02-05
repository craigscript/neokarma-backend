"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jws = require("jws");

var AuthPolicy = (_dec = Policy("Auth"), _dec(_class = function () {
	function AuthPolicy() {
		(0, _classCallCheck3.default)(this, AuthPolicy);
	}

	AuthPolicy.prototype.register = function register(app) {
		// Redis Session Store
		app.use(function (req, res, next) {

			if (req.headers['x-access-token']) {
				try {
					var result = jws.verify(req.headers['x-access-token'], "HS256", "neokarma-xaccess-token");
					if (!result) throw new Error("Invalid token");

					var decodedToken = jws.decode(req.headers['x-access-token']);
					if (!decodedToken) throw new Error("failed to decode token");

					return AuthService.session("redis").get(decodedToken.payload, function (error, user) {
						if (error) return res.json({ success: false, auth_failed: true, message: "Authorization failed." });
						req.user = user;
						next();
					});
				} catch (error) {
					console.log("Authorization error:", error.message);
					return res.json({ success: false, auth_failed: true, message: "Authorization failed." });
				}
			}
			next();
		});
	};

	AuthPolicy.prototype.route = function route(req, res, next) {
		if (req.user) {
			console.log("Authorized:", req.ip, req.geoip, req.user.email, "=>", req.path);
		} else {
			console.log("Unauthorized =>", req.ip, req.geoip, req.path);
		}

		// if we're on login, signup or logout page, or recover pw page then do nothing.
		if (req.path == "/" || req.path.startsWith("/auth")) {
			return next();
		}

		if (req.path == "/verify_login") {
			return next();
		}

		if (req.path.startsWith("/subscription/ipn/")) {
			return next();
		}

		return next();
	};

	AuthPolicy.prototype.validate = function validate(req, res, next) {
		if (!req.user) {
			return res.json({ success: false, auth_required: true, message: "Authorization required." });
		}
		next();
	};

	return AuthPolicy;
}()) || _class);
;