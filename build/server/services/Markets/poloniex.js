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

var PoloniexMarket = function (_Market) {
	(0, _inherits3.default)(PoloniexMarket, _Market);

	function PoloniexMarket() {
		(0, _classCallCheck3.default)(this, PoloniexMarket);
		return (0, _possibleConstructorReturn3.default)(this, _Market.call(this));
	}

	// "getVolume": "Volume",
	// "getQuoteVolume": "Quote Volume",
	// "getAverage": "Price",
	// "getHigh": "High",
	// "getLow": "Low"

	PoloniexMarket.prototype.buildQuery = function buildQuery(Interval, StartTime, EndTime, Market, Currency, SumMethod) {
		var GroupMethod = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

		var queries = [];
		queries.push({
			$match: {
				date: {
					$gte: StartTime * 1000,
					$lt: EndTime * 1000
				},
				MarketName: [Market, Currency].join("_")
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

	PoloniexMarket.prototype.getVolume = function getVolume(Market, Currency, StartTime, EndTime) {
		var Interval = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300;

		var queries = this.buildQuery(Interval, StartTime, EndTime, Market, Currency, { $avg: "$Volume" });
		return PoloniexCandles.aggregate(queries);
	};

	PoloniexMarket.prototype.getQuoteVolume = function getQuoteVolume(Market, Currency, StartTime, EndTime) {
		var Interval = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300;

		var queries = this.buildQuery(Interval, StartTime, EndTime, Market, Currency, { $avg: "$QuoteVolume" });
		return PoloniexCandles.aggregate(queries);
	};

	PoloniexMarket.prototype.getAverage = function getAverage(Market, Currency, StartTime, EndTime) {
		var Interval = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300;

		var queries = this.buildQuery(Interval, StartTime, EndTime, Market, Currency, { $avg: "$Price" });
		return PoloniexCandles.aggregate(queries);
	};

	PoloniexMarket.prototype.getHigh = function getHigh(Market, Currency, StartTime, EndTime) {
		var Interval = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300;

		var queries = this.buildQuery(Interval, StartTime, EndTime, Market, Currency, { $avg: "$High" });
		return PoloniexCandles.aggregate(queries);
	};

	PoloniexMarket.prototype.getLow = function getLow(Market, Currency, StartTime, EndTime) {
		var Interval = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300;

		var queries = this.buildQuery(Interval, StartTime, EndTime, Market, Currency, { $avg: "$Low" });
		return PoloniexCandles.aggregate(queries);
	};

	return PoloniexMarket;
}(_Market3.default);

exports.default = PoloniexMarket;
;