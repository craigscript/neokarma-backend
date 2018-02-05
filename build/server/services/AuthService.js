"use strict";

exports.__esModule = true;
exports.AuthService = undefined;

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _class;

var _redis = require("./AuthService/SessionStores/redis.js");

var _redis2 = _interopRequireDefault(_redis);

var _SessionStore = require("./AuthService/SessionStores/SessionStore.js");

var _SessionStore2 = _interopRequireDefault(_SessionStore);

var _AuthStrategy = require("./AuthService/AuthStrategies/AuthStrategy.js");

var _AuthStrategy2 = _interopRequireDefault(_AuthStrategy);

var _local = require("./AuthService/AuthStrategies/local.js");

var _local2 = _interopRequireDefault(_local);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SessionStores = {
	redis: _redis2.default,
	SessionStore: _SessionStore2.default
};
(0, _freeze2.default)(SessionStores);
var AuthStrategies = {
	AuthStrategy: _AuthStrategy2.default,
	local: _local2.default
};
(0, _freeze2.default)(AuthStrategies);

// Singleton service (creates an instance of this object)

var AuthService = SingletonService(_class = function () {
	function AuthService() {
		(0, _classCallCheck3.default)(this, AuthService);
		this.stores = {};
		this.startegies = {};
	}

	AuthService.prototype.session = function session(name) {
		if (!this.stores[name]) this.stores[name] = new SessionStores[name](this);
		return this.stores[name];
	};

	AuthService.prototype.strategy = function strategy(_strategy) {
		if (!this.startegies[_strategy]) this.startegies[_strategy] = new AuthStrategies[_strategy](this);
		return this.startegies[_strategy];
	};

	return AuthService;
}()) || _class;

exports.AuthService = AuthService;
;