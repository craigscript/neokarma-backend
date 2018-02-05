"use strict";

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _from = require("babel-runtime/core-js/array/from");

var _from2 = _interopRequireDefault(_from);

var _dec, _dec2, _dec3, _class, _desc, _value, _class2;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}

var UsageTrackings = (0, _from2.default)(Array(60), function () {
	return 0;
});
var LastUsageStat = 0;

var stats = {
	reddit: 0,
	tweets: 0,
	rss: 0,
	facebook: 0,
	mentions: 0,
	trackings: 0,
	keywords: 0,
	words: 0,

	quotas: {
		mentions: {
			used: 0,
			current: 0
		},
		trackers: {
			used: 0,
			current: 0
		},
		sources: {
			used: 0,
			current: 0
		}
	},
	timelines: {
		usage: UsageTrackings
	}
};

function cacheStats() {
	setTimeout(function () {
		var statqueries = [];
		var totalReddit = 0;
		statqueries.push(RedditPosts.count({}).then(function (reddit) {
			totalReddit += reddit;
		}));

		statqueries.push(RedditComments.count({}).then(function (reddit) {
			totalReddit += reddit;
		}));

		statqueries.push(TwitterTweets.count({}).then(function (tweets) {
			stats.tweets = tweets;
		}));

		_promise2.default.all(statqueries).then(function () {
			stats.reddit = totalReddit;
			var total = stats.reddit + stats.tweets;
			UsageTrackings.push(total - LastUsageStat);

			LastUsageStat = total;
			if (UsageTrackings.length > 60) UsageTrackings.shift();

			cacheStats();
		});
	}, 1000);
}

// setTimeout(() => {
// 	cacheStats();
// }, 1000);


var IndexController = (_dec = Controller("/dashboard"), _dec2 = GET("/stats"), _dec3 = GET("/getTickers"), _dec(_class = (_class2 = function () {
	function IndexController() {
		(0, _classCallCheck3.default)(this, IndexController);
	}

	IndexController.prototype.getStats = function getStats(req, res) {
		var userStats = {
			mentions: 0,
			trackings: 0
		};
		var statqueries = [];
		statqueries.push(Mentions.count({ user: req.user._id }).then(function (mentions) {
			userStats.mentions = mentions;
		}));
		statqueries.push(TrackingSites.count({ user: req.user._id }).then(function (trackings) {
			userStats.trackings = trackings;
		}));
		stats.quotas = req.user.quotas;
		_promise2.default.all(statqueries).then(function () {
			res.json({
				success: true,
				stats: (0, _assign2.default)(stats, userStats)
			});
		});
	};

	IndexController.prototype.getTickers = function getTickers(req, res) {
		var settings = req.user.settings;
		if (!settings || !settings.tickers) return res.json({ success: true, tickers: [] });

		var tickers = [];
		var promises = [];
		for (var _iterator = settings.tickers, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var ticker = _ref;

			var marketInstance = MarketService.create(ticker.exchange);
			if (!marketInstance) continue;

			promises.push(marketInstance.getTicker(ticker.market).then(function (ticker) {
				if (ticker.success) {
					tickers.push(ticker.data);
				}
			}).catch(function (error) {
				console.log("Ticker Error:", error);
				return _promise2.default.resolve(null);
			}));

			tickers.push(marketInstance.getTicker(ticker.market));
		}
		_promise2.default.all(promises).then(function () {
			res.json({ success: true, tickers: tickers });
		}).catch;
	};

	return IndexController;
}(), (_applyDecoratedDescriptor(_class2.prototype, "getStats", [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getStats"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getTickers", [_dec3], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getTickers"), _class2.prototype)), _class2)) || _class);
;