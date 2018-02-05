"use strict";

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _class, _class2, _temp;

var _bittrex = require("./Markets/bittrex.js");

var _bittrex2 = _interopRequireDefault(_bittrex);

var _coinbase = require("./Markets/coinbase.js");

var _coinbase2 = _interopRequireDefault(_coinbase);

var _coinmarketcap = require("./Markets/coinmarketcap.js");

var _coinmarketcap2 = _interopRequireDefault(_coinmarketcap);

var _poloniex = require("./Markets/poloniex.js");

var _poloniex2 = _interopRequireDefault(_poloniex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Markets = {
	bittrex: _bittrex2.default,
	coinbase: _coinbase2.default,
	coinmarketcap: _coinmarketcap2.default,
	poloniex: _poloniex2.default
};
(0, _freeze2.default)(Markets);

var MarketService = Service(_class = (_temp = _class2 = function () {
	function MarketService() {
		(0, _classCallCheck3.default)(this, MarketService);
	}

	MarketService.create = function create(marketName) {
		if (!Markets[marketName]) return null;

		if (!MarketService.SMarkets[marketName]) {
			MarketService.SMarkets[marketName] = new Markets[marketName]();
		}
		return MarketService.SMarkets[marketName];
	};

	return MarketService;
}(), _class2.SMarkets = {}, _temp)) || _class;

;