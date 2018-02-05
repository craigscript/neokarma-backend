"use strict";

exports.__esModule = true;
exports.default = undefined;

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _word = require("./mention/word.js");

var _word2 = _interopRequireDefault(_word);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Filters = {
	word: _word2.default
};
(0, _freeze2.default)(Filters);

var MentionSource = function () {
	function MentionSource(target, options) {
		(0, _classCallCheck3.default)(this, MentionSource);
		this.target = "";
		this.options = {};
		this.queryStream = [];

		this.target = target;
		this.options = options;
		// Apply sub reddit filter
		// this.applyFilter([{
		// 	$match: {
		// 		subreddit: target,
		// 	},
		// }]);
	}

	MentionSource.prototype.extractInRange = function extractInRange(Interval, StartTime, EndTime) {
		console.log("Aggeragating in range Interval:", Interval, StartTime, EndTime);
		return this.queryRange(Interval, StartTime, EndTime, this.options.user).then(function (data) {
			return data;
		});
	};

	MentionSource.prototype.applyFilters = function applyFilters() {
		var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	};

	MentionSource.prototype.applyFilter = function applyFilter() {
		var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

		for (var _iterator = filters, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var filter = _ref;

			this.queryStream.push(filter);
		}
	};

	MentionSource.prototype.queryRange = function queryRange(Interval, StartTime, EndTime, UserId) {
		console.log("Aggregating mention data");
		var queries = this.queryStream;
		queries.unshift({
			$match: {
				user: UserId,
				tracker: this.target,
				date: {
					$gte: StartTime * 1000,
					$lt: EndTime * 1000
				}
			}
		});

		// Group by StepSize (Zoom Level)
		queries.push({
			$group: {
				_id: {
					timestamp: {
						$subtract: [{
							$divide: ['$date', Interval * 1000]
						}, {
							$mod: [{
								$divide: ['$date', Interval * 1000]
							}, 1]
						}]
					}
				},
				value: {
					$sum: 1
				}
			}
		});
		// Sort by date
		queries.push({
			$sort: { "_id.timestamp": 1 }
		});
		// Format date & timestamp
		queries.push({
			$project: {
				_id: 0,
				timestamp: {
					$multiply: [Interval * 1000, "$_id.timestamp"]
				},
				value: "$value",
				date: {
					$add: [new Date(0), {
						$multiply: [Interval * 1000, "$_id.timestamp"]
					}]
				}
			}
		});

		return Mentions.aggregate(queries).then(function (results) {
			return ChartifyService.Chartify(StartTime * 1000, EndTime * 1000, Interval * 1000, results);
		});
	};

	return MentionSource;
}();

exports.default = MentionSource;
;