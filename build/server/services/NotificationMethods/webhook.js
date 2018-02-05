"use strict";

exports.__esModule = true;
exports.default = undefined;

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require("request");

var WebhookNotification = function () {
	function WebhookNotification(options) {
		(0, _classCallCheck3.default)(this, WebhookNotification);
		this.WebhookURL = null;
		this.requestMethod = "GET";
		this.methods = {
			GET: request.get,
			POST: request.post,
			PUT: request.put,
			DELETE: request.delete
		};

		this.WebhookURL = options.url;
		this.requestMethod = options.method;
	}

	WebhookNotification.prototype.send = function send(tracker) {
		var _this = this;

		if (!this.WebhookURL) {
			return _promise2.default.reject("No webhook defined.");
		}
		return new _promise2.default(function (resolve, reject) {
			_this.methods[_this.requestMethod](_this.WebhookURL, function (error, response, body) {
				if (error) {
					return reject(error);
				}
				resolve();
			});
			console.log("[Tracker Notify] Webhook sent:", _this.WebhookURL);
		});
	};

	return WebhookNotification;
}();

exports.default = WebhookNotification;
;