"use strict";

exports.__esModule = true;
exports.default = undefined;

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Filters = {};
(0, _freeze2.default)(Filters);

var MarketSource = function () {
	function MarketSource(target, options) {
		(0, _classCallCheck3.default)(this, MarketSource);
		this.target = "";
		this.options = {};
		this.queryStream = [];

		this.target = target;
		this.options = options;
		console.log("this.target:", this.target);
		console.log("this.options", this.options);
		// Apply sub reddit filter
	}

	MarketSource.prototype.extractInRange = function extractInRange(Interval, StartTime, EndTime, User) {
		console.log("Aggeragating in range Interval:", Interval, StartTime, EndTime);
		return this.queryRange(Interval, StartTime, EndTime, User).then(function (data) {
			return data;
		});
	};

	MarketSource.prototype.applyFilters = function applyFilters() {
		var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	};

	MarketSource.prototype.applyFilter = function applyFilter() {
		var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	};

	MarketSource.prototype.queryRange = function queryRange(Interval, StartTime, EndTime, User) {
		var exchange = this.target;
		var dataType = this.options.query;
		var market = this.options.market;
		var currency = this.options.currency;

		console.log("MARKET QUERY: ", this.target, this.options);
		var marketInstance = MarketService.create(exchange);

		if (!marketInstance) {
			return _promise2.default.reject("No such market");
		}

		if (!marketInstance.hasData(dataType)) {
			return _promise2.default.reject("No such market data");
		}

		return new _promise2.default(function (resolve, reject) {
			marketInstance[dataType](market, currency, StartTime, EndTime, Interval).then(function (marketVolume) {
				resolve(marketVolume);
			}).catch(function (error) {
				reject(error);
			});
		});
	};

	return MarketSource;
}();

exports.default = MarketSource;
;