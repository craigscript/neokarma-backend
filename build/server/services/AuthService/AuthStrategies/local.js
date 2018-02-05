"use strict";

exports.__esModule = true;
exports.default = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _AuthStrategy2 = require("./AuthStrategy");

var _redis = require("redis");

var _redis2 = _interopRequireDefault(_redis);

var _jws = require("jws");

var _jws2 = _interopRequireDefault(_jws);

var _aguid = require("aguid");

var _aguid2 = _interopRequireDefault(_aguid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LocalStrategy = function (_AuthStrategy) {
	(0, _inherits3.default)(LocalStrategy, _AuthStrategy);

	function LocalStrategy(authservice) {
		(0, _classCallCheck3.default)(this, LocalStrategy);
		return (0, _possibleConstructorReturn3.default)(this, _AuthStrategy.call(this));
	}

	LocalStrategy.prototype.authenticate = function authenticate(email, password, done) {
		if (!email) return done("No email provided");

		email = email.toLowerCase();

		User.findOne({ email: email }).populate("group").then(function (user) {
			if (!user || user.email != email) {
				return done(null, null);
			}
			console.log("Logging in with:", email, "Password:", password);
			if (!user.validatePassword(password)) {
				return done(null, null);
			}
			console.log("User logged in:", user.email);
			return done(null, user);
		}).catch(function (err) {
			console.log("Error", err);
			return done(err);
		});
	};

	LocalStrategy.prototype.getSessionInfo = function getSessionInfo(user) {
		var sessionId = (0, _aguid2.default)(user._id + new Date());
		return {
			token: _jws2.default.sign({
				header: { alg: 'HS256' },
				payload: sessionId,
				secret: 'neokarma-xaccess-token'
			}),
			sessionId: sessionId
		};
	};

	return LocalStrategy;
}(_AuthStrategy2.AuthStrategy);

exports.default = LocalStrategy;