"use strict";

exports.__esModule = true;
exports.SessionStore = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SessionStore = exports.SessionStore = function () {
	function SessionStore() {
		(0, _classCallCheck3.default)(this, SessionStore);
	}

	SessionStore.prototype.serialize = function serialize(sessionId, user, expiration, done) {
		// Store user session
		done("Not implemented");
	};

	SessionStore.prototype.deseralize = function deseralize(sessionId, done) {
		// Get User session
		done("Not implemented");
	};

	return SessionStore;
}();

;