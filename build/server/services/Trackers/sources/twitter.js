"use strict";

exports.__esModule = true;
exports.default = undefined;

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _user = require("./twitter/user.js");

var _user2 = _interopRequireDefault(_user);

var _word = require("./twitter/word.js");

var _word2 = _interopRequireDefault(_word);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Filters = {
	user: _user2.default,
	word: _word2.default
};
(0, _freeze2.default)(Filters);

var RedditSource = function () {
	function RedditSource(target, options) {
		(0, _classCallCheck3.default)(this, RedditSource);
		this.target = "";
		this.options = {};
		this.queryStream = [];
		this.Extractors = {
			tweets: "extractTweets",
			retweets: "extractRetweets",
			sentiment: "extractSentiment"
		};

		this.target = target;
		this.options = options;

		console.log("Twitter Extractor ready:", target, options);

		// Apply sub twitter filter
		this.applyFilter([{
			$match: {
				topics: { $in: [this.target] }
			}
		}]);
	}

	RedditSource.prototype.extractInRange = function extractInRange(Interval, StartTime, EndTime) {
		if (!this.Extractors[this.options.extract]) {
			return _promise2.default.resolve([]);
		}

		console.log("Aggeragating in range Interval:", Interval, StartTime, EndTime);
		return this.queryRange(Interval, StartTime, EndTime).then(function (data) {
			return data;
		});
	};

	RedditSource.prototype.applyFilters = function applyFilters() {
		var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

		console.log("Filters:", filters);
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

			if (!Filters[filter.name]) continue;
			var queries = Filters[filter.name](filter.data);
			this.applyFilter(queries);
		}
	};

	RedditSource.prototype.applyFilter = function applyFilter() {
		var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

		for (var _iterator2 = filters, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);;) {
			var _ref2;

			if (_isArray2) {
				if (_i2 >= _iterator2.length) break;
				_ref2 = _iterator2[_i2++];
			} else {
				_i2 = _iterator2.next();
				if (_i2.done) break;
				_ref2 = _i2.value;
			}

			var filter = _ref2;

			this.filterQueries.push(filter);
		}
	};

	RedditSource.prototype.applyFilter = function applyFilter() {
		var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

		for (var _iterator3 = filters, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : (0, _getIterator3.default)(_iterator3);;) {
			var _ref3;

			if (_isArray3) {
				if (_i3 >= _iterator3.length) break;
				_ref3 = _iterator3[_i3++];
			} else {
				_i3 = _iterator3.next();
				if (_i3.done) break;
				_ref3 = _i3.value;
			}

			var filter = _ref3;

			this.queryStream.push(filter);
		}
	};

	RedditSource.prototype.queryRange = function queryRange(Interval, StartTime, EndTime) {
		console.log("Aggregating twitter data:", this.options);

		return this[this.Extractors[this.options.extract]](Interval, StartTime, EndTime).then(function (results) {
			console.log("Twitter:", results);
			return ChartifyService.Chartify(StartTime * 1000, EndTime * 1000, Interval * 1000, results);
		}).catch(function (error) {
			console.log("Error:", error);
			return error;
		});
	};

	RedditSource.prototype.buildQuery = function buildQuery(Interval, StartTime, EndTime, SumMethod) {
		var GroupMethod = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

		var queries = this.queryStream;

		queries.unshift({
			$match: {
				date: {
					$gte: StartTime,
					$lt: EndTime
				}
			}
		});

		// Group by StepSize (Zoom Level)
		queries.push({
			$group: {
				_id: (0, _assign2.default)({
					timestamp: {
						$subtract: [{
							$divide: ['$date', Interval]
						}, {
							$mod: [{
								$divide: ['$date', Interval]
							}, 1]
						}]
					}
				}, GroupMethod),
				value: SumMethod
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
		return queries;
	};

	RedditSource.prototype.extractTweets = function extractTweets(Interval, StartTime, EndTime) {
		var queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: 1 });
		console.log("Tweet extractor", queries);
		return TwitterTweets.aggregate(queries);
	};

	RedditSource.prototype.extractRetweets = function extractRetweets(Interval, StartTime, EndTime) {
		var queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: "$origin.count" });
		console.log("Retweet extractor", queries);
		return TwitterTweets.aggregate(queries);
	};

	RedditSource.prototype.extractSentiment = function extractSentiment(Interval, StartTime, EndTime) {
		var queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: "$sentiment.score" });
		console.log("Sentiment extractor", queries);
		return TwitterTweets.aggregate(queries);
	};

	return RedditSource;
}();

exports.default = RedditSource;
;