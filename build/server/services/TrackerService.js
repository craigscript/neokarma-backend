"use strict";

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _class, _class2, _temp;

var _TrackerExtractor = require("./Trackers/TrackerExtractor.js");

var _TrackerExtractor2 = _interopRequireDefault(_TrackerExtractor);

var _SourceExtractor = require("./Trackers/SourceExtractor.js");

var _SourceExtractor2 = _interopRequireDefault(_SourceExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Actions = {};
(0, _freeze2.default)(Actions);


global.MAX_GRAPH_POINTS = 2000;

var TrackerService = Service(_class = (_temp = _class2 = function () {
	function TrackerService() {
		(0, _classCallCheck3.default)(this, TrackerService);
	}

	TrackerService.validateTracker = function validateTracker(tracker) {
		tracker.soour;
	};

	TrackerService.validateSource = function validateSource(source) {
		// if(source.actions)	
	};

	TrackerService.prototype.getActionNames = function getActionNames() {
		return (0, _keys2.default)(Actions);
	};

	return TrackerService;
}(), _class2.TrackerExtractor = _TrackerExtractor2.default, _class2.SourceExtractor = _SourceExtractor2.default, _temp)) || _class;

;