"use strict";

exports.__esModule = true;
exports.default = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EmailNotification = function () {
	function EmailNotification(options) {
		(0, _classCallCheck3.default)(this, EmailNotification);
	}

	EmailNotification.prototype.send = function send(tracker) {
		console.log("[Tracker Notify] Email Notification Sent:", tracker.name);
	};

	return EmailNotification;
}();

exports.default = EmailNotification;
;