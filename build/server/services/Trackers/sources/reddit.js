"use strict";

exports.__esModule = true;
exports.default = undefined;

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _commentnum = require("./reddit/commentnum.js");

var _commentnum2 = _interopRequireDefault(_commentnum);

var _downvote = require("./reddit/downvote.js");

var _downvote2 = _interopRequireDefault(_downvote);

var _score = require("./reddit/score.js");

var _score2 = _interopRequireDefault(_score);

var _sentiment = require("./reddit/sentiment.js");

var _sentiment2 = _interopRequireDefault(_sentiment);

var _subreddit = require("./reddit/subreddit.js");

var _subreddit2 = _interopRequireDefault(_subreddit);

var _title = require("./reddit/title.js");

var _title2 = _interopRequireDefault(_title);

var _upvote = require("./reddit/upvote.js");

var _upvote2 = _interopRequireDefault(_upvote);

var _user = require("./reddit/user.js");

var _user2 = _interopRequireDefault(_user);

var _word = require("./reddit/word.js");

var _word2 = _interopRequireDefault(_word);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Filters = {
	commentnum: _commentnum2.default,
	downvote: _downvote2.default,
	score: _score2.default,
	sentiment: _sentiment2.default,
	subreddit: _subreddit2.default,
	title: _title2.default,
	upvote: _upvote2.default,
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
		this.filterQueries = [];
		this.Extractors = {
			posts: "extractPosts",
			comments: "extractComments",
			submissions: "extractSubmissions",
			users: "extractUsers",
			upvotes: "extractUpvotes",
			downvotes: "extractDownvotes",
			votes: "extractVotes",
			score: "extractScore",
			sentiment: "extractSentiment"
		};

		this.target = target;
		this.options = options;

		console.log("Reddit Extractor ready:", target, options);

		// Apply sub reddit filter
		this.applyFilter([{
			$match: {
				subreddit: target.toLowerCase()
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

	RedditSource.prototype.queryRange = function queryRange(Interval, StartTime, EndTime) {
		console.log("Aggregating reddit data:", this.options);

		return this[this.Extractors[this.options.extract]](Interval, StartTime, EndTime).then(function (results) {
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

		for (var _iterator3 = this.filterQueries, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : (0, _getIterator3.default)(_iterator3);;) {
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

			queries.push(filter);
		}

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

	RedditSource.prototype.extractPosts = function extractPosts(Interval, StartTime, EndTime) {
		var queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: 1 });
		console.log("Post extractor", queries);
		return RedditPosts.aggregate(queries);
	};

	RedditSource.prototype.extractComments = function extractComments(Interval, StartTime, EndTime) {
		//let queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: "$num_comments" });
		var queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: 1 });
		console.log("Comment extractor", queries);
		return RedditComments.aggregate(queries);
	};

	RedditSource.prototype.extractSubmissions = function extractSubmissions(Interval, StartTime, EndTime) {
		var _this = this;

		//let queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: "$num_comments" });
		var queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: 1 });
		console.log("Submission extractor?");
		return RedditPosts.aggregate(queries).then(function () {
			var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(posts) {
				var comments, i;
				return _regenerator2.default.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.next = 2;
								return RedditComments.aggregate(queries);

							case 2:
								comments = _context.sent;

								for (i = 0; i < posts.length; ++i) {
									if (comments[i]) {
										posts[i].value += comments[i].value;
									}
								}
								return _context.abrupt("return", posts);

							case 5:
							case "end":
								return _context.stop();
						}
					}
				}, _callee, _this);
			}));

			return function (_x4) {
				return _ref4.apply(this, arguments);
			};
		}());
	};

	RedditSource.prototype.exctractUsers = function exctractUsers(Interval, StartTime, EndTime) {
		var queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: 1 }, { user: "$user" });
		console.log("User extractor", queries);
		return RedditPosts.aggregate(queries);
	};

	RedditSource.prototype.extractUpvotes = function extractUpvotes(Interval, StartTime, EndTime) {
		var queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: "$ups" });
		console.log("Upvote extractor", queries);
		return RedditPosts.aggregate(queries);
	};

	RedditSource.prototype.extractDownvotes = function extractDownvotes(Interval, StartTime, EndTime) {
		var queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: "$downs" });
		console.log("Upvote extractor", queries);
		return RedditPosts.aggregate(queries);
	};

	RedditSource.prototype.extractVotes = function extractVotes(Interval, StartTime, EndTime) {
		var queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: { $add: ["$ups", "$downs"] } });
		console.log("Votes extractor", queries);
		return RedditPosts.aggregate(queries);
	};

	RedditSource.prototype.extractScore = function extractScore(Interval, StartTime, EndTime) {
		var queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: "$score" });
		console.log("Score extractor", queries);
		return RedditPosts.aggregate(queries);
	};

	RedditSource.prototype.extractSentiment = function extractSentiment(Interval, StartTime, EndTime) {
		var queries = this.buildQuery(Interval, StartTime, EndTime, { $sum: "$sentiment.score" });
		console.log("Sentiment extractor", queries);
		return RedditPosts.aggregate(queries);
	};

	return RedditSource;
}();

exports.default = RedditSource;
;