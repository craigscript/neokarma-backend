"use strict";

exports.__esModule = true;
exports.default = undefined;

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _RedditTracker = require("./Trackers/RedditTracker.js");

var _RedditTracker2 = _interopRequireDefault(_RedditTracker);

var _TrackerBase = require("./Trackers/TrackerBase.js");

var _TrackerBase2 = _interopRequireDefault(_TrackerBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TrackerTypes = {
	RedditTracker: _RedditTracker2.default,
	TrackerBase: _TrackerBase2.default
};
(0, _freeze2.default)(TrackerTypes);

var TrackerManager = function TrackerManager() {
	(0, _classCallCheck3.default)(this, TrackerManager);

	console.log("Tracker types: ready:", TrackerTypes);
};

exports.default = TrackerManager;