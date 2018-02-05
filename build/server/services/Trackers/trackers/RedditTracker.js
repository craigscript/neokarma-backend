"use strict";

exports.__esModule = true;
exports.default = undefined;

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _TrackerBase2 = require("./TrackerBase.js");

var _TrackerBase3 = _interopRequireDefault(_TrackerBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tracker = function (_TrackerBase) {
	(0, _inherits3.default)(Tracker, _TrackerBase);

	function Tracker() {
		(0, _classCallCheck3.default)(this, Tracker);
		return (0, _possibleConstructorReturn3.default)(this, _TrackerBase.apply(this, arguments));
	}

	Tracker.prototype.createTracker = function createTracker() {
		return _promise2.default.reject("Test: not implemented");
	};

	return Tracker;
}(_TrackerBase3.default);

exports.default = Tracker;
;