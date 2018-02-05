"use strict";

exports.__esModule = true;
exports.default = undefined;

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tracker = function () {
	function Tracker() {
		(0, _classCallCheck3.default)(this, Tracker);
	}

	Tracker.prototype.createTracker = function createTracker() {
		return _promise2.default.reject("Not implemented");
	};

	Tracker.prototype.updateTracker = function updateTracker() {
		return _promise2.default.reject("Not implemented");
	};

	Tracker.prototype.deleteTracker = function deleteTracker() {
		return _promise2.default.reject("Not implemented");
	};

	return Tracker;
}();

exports.default = Tracker;
;