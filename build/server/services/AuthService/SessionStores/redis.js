"use strict";

exports.__esModule = true;
exports.default = undefined;

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _SessionStore2 = require("./SessionStore");

var _redis = require("redis");

var _redis2 = _interopRequireDefault(_redis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RedisStore = function (_SessionStore) {
	(0, _inherits3.default)(RedisStore, _SessionStore);

	function RedisStore(authservice) {
		(0, _classCallCheck3.default)(this, RedisStore);

		var _this = (0, _possibleConstructorReturn3.default)(this, _SessionStore.call(this));

		_this.client = null;

		_this.sessionKey = Config.redisSession.sessionKey;
		_this.createConnection(Config.redisSession.redis);
		return _this;
	}

	RedisStore.prototype.createConnection = function createConnection(redisConfig) {
		this.client = _redis2.default.createClient(redisConfig);
		this.client.on("error", function (error) {
			console.error("[Redis] Error:", error);
		});
		this.client.on("connect", function () {
			console.log("[Redis] Connected.");
		});
		this.client.on("reconnecting", function () {
			console.warn("[Redis] Warning: Reconnecting.");
		});
	};

	// Store user session


	RedisStore.prototype.save = function save(sessionId, user, expiration, done) {
		var _this2 = this;

		this.client.set(this.sessionKey + ":" + sessionId, (0, _stringify2.default)(user), function (err, result) {

			// Expire the session if expiration is greater than 0
			if (expiration <= 0) expiration = 60 * 60 * 24 * 7;

			_this2.client.expire(_this2.sessionKey + ":" + sessionId, expiration);

			done(err);
		});
	};

	// Get User session


	RedisStore.prototype.get = function get(sessionId, done) {
		this.client.get(this.sessionKey + ":" + sessionId, function (err, user) {
			done(err, JSON.parse(user));
		});
	};

	RedisStore.prototype.drop = function drop(sessionId, done) {
		this.client.del(this.sessionKey + ":" + sessionId, function (err, result) {
			done(err);
		});
	};

	return RedisStore;
}(_SessionStore2.SessionStore);

exports.default = RedisStore;