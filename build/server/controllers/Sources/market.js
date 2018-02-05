"use strict";

exports.__esModule = true;
exports.default = undefined;

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _bittrex = require("./markets/bittrex.json");

var _bittrex2 = _interopRequireDefault(_bittrex);

var _coinbase = require("./markets/coinbase.json");

var _coinbase2 = _interopRequireDefault(_coinbase);

var _coinmarketcap = require("./markets/coinmarketcap.json");

var _coinmarketcap2 = _interopRequireDefault(_coinmarketcap);

var _poloniex = require("./markets/poloniex.json");

var _poloniex2 = _interopRequireDefault(_poloniex);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MarketList = {
	bittrex: _bittrex2.default,
	coinbase: _coinbase2.default,
	coinmarketcap: _coinmarketcap2.default,
	poloniex: _poloniex2.default
};
(0, _freeze2.default)(MarketList);

var MarketSource = function () {
	function MarketSource() {
		(0, _classCallCheck3.default)(this, MarketSource);
	}

	MarketSource.prototype.getSourceOptions = function getSourceOptions(req, res) {
		// var exchanges = [];
		// console.log(Object.keys(ExchangesData));
		// for(let exchangeName in ExchangesData)
		// {
		// 	exchanges.push(ExchangesData[exchangeName]);
		// }
		return res.json({ success: true, exchanges: MarketList });
	};

	return MarketSource;
}();

exports.default = MarketSource;