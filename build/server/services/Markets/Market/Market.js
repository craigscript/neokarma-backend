'use strict';

exports.__esModule = true;
exports.default = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Market = function () {
	function Market() {
		(0, _classCallCheck3.default)(this, Market);
	}

	Market.prototype.hasData = function hasData(dataType) {
		if (['getChartData', 'getVolume', 'getQuoteVolume', 'getOpen', 'getClose', 'getHigh', 'getLow', 'getAverage'].indexOf(dataType) >= 0) return true;
		return false;
	};

	Market.prototype.getChartData = function getChartData(CurrencyA, CurrencyB, StartTime, EndTime) {
		var Interval = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300;

		return _promise2.default.reject("Not implemented");
	};

	Market.prototype.getVolume = function getVolume(CurrencyA, CurrencyB, StartTime, EndTime) {
		var Interval = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300;

		return _promise2.default.reject("Not implemented");
	};

	Market.prototype.getQuoteVolume = function getQuoteVolume(CurrencyA, CurrencyB, StartTime, EndTime) {
		var Interval = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300;

		return _promise2.default.reject("Not implemented");
	};

	Market.prototype.getOpen = function getOpen(CurrencyA, CurrencyB, StartTime, EndTime) {
		var Interval = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300;

		return _promise2.default.reject("Not implemented");
	};

	Market.prototype.getClose = function getClose(CurrencyA, CurrencyB, StartTime, EndTime) {
		var Interval = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300;

		return _promise2.default.reject("Not implemented");
	};

	Market.prototype.getHigh = function getHigh(CurrencyA, CurrencyB, StartTime, EndTime) {
		var Interval = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300;

		return _promise2.default.reject("Not implemented");
	};

	Market.prototype.getLow = function getLow(CurrencyA, CurrencyB, StartTime, EndTime) {
		var Interval = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300;

		return _promise2.default.reject("Not implemented");
	};

	Market.prototype.getAverage = function getAverage(CurrencyA, CurrencyB, StartTime, EndTime) {
		var Interval = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300;

		return _promise2.default.reject("Not implemented");
	};

	return Market;
}();

exports.default = Market;
;