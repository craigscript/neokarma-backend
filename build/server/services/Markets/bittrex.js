"use strict";

exports.__esModule = true;
exports.default = undefined;

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _Market2 = require("./Market/Market");

var _Market3 = _interopRequireDefault(_Market2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = require('util');

var BittrexMarket = function (_Market) {
	(0, _inherits3.default)(BittrexMarket, _Market);

	function BittrexMarket() {
		(0, _classCallCheck3.default)(this, BittrexMarket);
		return (0, _possibleConstructorReturn3.default)(this, _Market.call(this));
	}

	// "getVolume": "Volume",
	// "getQuoteVolume": "Quote Volume",
	// "getAverage": "Price",
	// "getHigh": "High",
	// "getLow": "Low"

	BittrexMarket.prototype.buildQuery = function buildQuery(Interval, StartTime, EndTime, Market, Currency, SumMethod) {
		var GroupMethod = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

		var queries = [];
		queries.push({
			$match: {
				date: {
					$gte: StartTime * 1000,
					$lt: EndTime * 1000
				},
				MarketName: [Market, Currency].join("-")
			}
		});

		// Group by StepSize (Zoom Level)
		queries.push({
			$group: {
				_id: (0, _assign2.default)({
					timestamp: {
						$subtract: [{
							$divide: ['$date', Interval * 1000]
						}, {
							$mod: [{
								$divide: ['$date', Interval * 1000]
							}, 1]
						}]
					}
				}, GroupMethod),
				value: SumMethod
			}
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

		// Sort by date
		queries.push({
			$sort: { "_id.timestamp": 1 }
		});
		return queries;
	};

	BittrexMarket.prototype.getVolume = function getVolume(Market, Currency, StartTime, EndTime) {
		var Interval = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300;

		var queries = this.buildQuery(Interval, StartTime, EndTime, Market, Currency, { $avg: "$BaseVolume" });
		return BittrexCandles.aggregate(queries);
	};

	BittrexMarket.prototype.getQuoteVolume = function getQuoteVolume(Market, Currency, StartTime, EndTime) {
		var Interval = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300;

		var queries = this.buildQuery(Interval, StartTime, EndTime, Market, Currency, { $avg: "$Volume" });
		return BittrexCandles.aggregate(queries);
	};

	BittrexMarket.prototype.getAverage = function getAverage(Market, Currency, StartTime, EndTime) {
		var Interval = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300;

		var queries = this.buildQuery(Interval, StartTime, EndTime, Market, Currency, { $avg: { $add: [{ $divide: [{ $subtract: ["$High", "$Low"] }, 2] }, "$Low"] } });
		return BittrexCandles.aggregate(queries);
	};

	BittrexMarket.prototype.getHigh = function getHigh(Market, Currency, StartTime, EndTime) {
		var Interval = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300;

		var queries = this.buildQuery(Interval, StartTime, EndTime, Market, Currency, { $avg: "$High" });
		return BittrexCandles.aggregate(queries);
	};

	BittrexMarket.prototype.getLow = function getLow(Market, Currency, StartTime, EndTime) {
		var Interval = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300;

		var queries = this.buildQuery(Interval, StartTime, EndTime, Market, Currency, { $avg: "$Low" });
		return BittrexCandles.aggregate(queries);
	};

	return BittrexMarket;
}(_Market3.default);

exports.default = BittrexMarket;
;