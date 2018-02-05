"use strict";

exports.__esModule = true;
exports.AuthStrategy = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AuthStrategy = exports.AuthStrategy = function () {
	function AuthStrategy() {
		(0, _classCallCheck3.default)(this, AuthStrategy);
	}

	AuthStrategy.prototype.authenticate = function authenticate(email, password, done) {
		done("not implemented");
	};

	AuthStrategy.prototype.getSessionId = function getSessionId(user) {
		return null;
	};

	return AuthStrategy;
}();

;