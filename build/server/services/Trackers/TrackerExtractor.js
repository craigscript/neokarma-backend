"use strict";

exports.__esModule = true;
exports.default = undefined;

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _SourceExtractor = require("./SourceExtractor.js");

var _SourceExtractor2 = _interopRequireDefault(_SourceExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TrackerExtractor = function () {
	function TrackerExtractor(Tracker) {
		(0, _classCallCheck3.default)(this, TrackerExtractor);
		this.tracker = null;

		this.tracker = Tracker;
	}

	TrackerExtractor.prototype.getDataInRange = function getDataInRange(Interval, StartTime, EndTime) {
		// Extract sources with filters applied
		var sources = [];
		var resolvers = [];
		for (var _iterator = this.tracker.sources, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var trackerSource = _ref;

			var extractor = new _SourceExtractor2.default(trackerSource);
			var resolver = extractor.extractInRange(Interval, StartTime, EndTime).then(function (timeSeries) {
				sources.push(timeSeries);
			});
			resolvers.push(resolver);
		}

		// Process actions when all sources are resolved
		return _promise2.default.all(resolvers).then(function () {
			// return this.performActions(sources).then( result => {
			// 	console.log("Performed actions:");
			// });
			var output = [];
			for (var i = 0; i < sources.length; ++i) {
				for (var s = 0; s < sources[i].length; ++s) {
					if (!output[s]) {
						output[s] = sources[i][s];
						continue;
					}
					output[s].value += sources[i][s].value;
				}
			}
			return output;
		});
	};

	TrackerExtractor.prototype.performActions = function performActions(sources) {
		for (var _iterator2 = tracker.actions, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);;) {
			var _ref2;

			if (_isArray2) {
				if (_i2 >= _iterator2.length) break;
				_ref2 = _iterator2[_i2++];
			} else {
				_i2 = _iterator2.next();
				if (_i2.done) break;
				_ref2 = _i2.value;
			}

			var action = _ref2;
		}
		return [];
	};

	return TrackerExtractor;
}();

exports.default = TrackerExtractor;
;