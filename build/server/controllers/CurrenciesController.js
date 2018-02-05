"use strict";

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _class, _desc, _value, _class2;

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

var CurrenciesController = (_dec = Controller("/currencies"), _dec2 = CACHE(15), _dec3 = GET("/"), _dec4 = GET("/getCurrencies"), _dec5 = CACHE(15), _dec6 = GET("/getSorted/:sortKey/:order"), _dec7 = CACHE(15), _dec8 = GET("/getRates"), _dec9 = CACHE(5), _dec10 = GET("/getCurrency/:currency"), _dec11 = CACHE(5), _dec12 = GET("/getTickers"), _dec13 = CACHE(5), _dec14 = GET("/getTicker/:currency"), _dec15 = POST("/search"), _dec16 = CACHE(60), _dec17 = GET("/history/:currency/:startTime/:endTime/:interval/:index"), _dec18 = CACHE(5), _dec19 = GET("/getChanges/:startTime/:endTime/:interval/:metric/:direction"), _dec20 = CACHE(5), _dec21 = GET("/getVolumeRankings/:startTime/:endTime/:interval/:metric/:direction"), _dec(_class = (_class2 = function () {
	function CurrenciesController() {
		(0, _classCallCheck3.default)(this, CurrenciesController);
	}

	CurrenciesController.prototype.index = function index(req, res) {
		var paging = req.params.paging || 0;
		Currencies.find({ visible: true }, { _id: 0, exchanges: 0, indexes: 0 }).sort({ rank: -1 }).lean().then(function (currencies) {
			res.cjson({
				success: true,
				currencies: currencies
			});
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	// Returns currency ticker (Updated every second) => LATEST PRICE


	CurrenciesController.prototype.getSorted = function getSorted(req, res) {
		var sortKey = req.params.sortKey;
		var order = req.params.order;

		var sortQuery = {};
		sortQuery["ticker." + sortKey] = order;
		Currencies.find({
			visible: true
		}, { _id: 0, exchanges: 0, indexes: 0 }).sort(sortQuery).lean().limit(50).then(function (currencies) {
			res.cjson({
				success: true,
				currencies: currencies
			});
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	// Returns exchange rates


	CurrenciesController.prototype.getRates = function getRates(req, res) {
		var currencies = ["usd", "btc"];
		Currencies.findOne({ currency: "bitcoin" }).then(function (bitcoin) {
			return res.cjson({ success: true, rates: {
					usd: 1,
					btc: bitcoin.ticker.Price
				} });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	// Returns a single currency


	CurrenciesController.prototype.getCurrency = function getCurrency(req, res) {
		var currency = req.params.currency;
		Currencies.findOne({
			currency: currency,
			visible: true
		}, { _id: 0, exchanges: 0, indexes: 0 }).lean().then(function (currency) {

			if (!currency) return res.error("No such currency");

			return res.cjson({ success: true, currency: currency });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	// Returns currency ticker (Updated every second) => LATEST PRICE


	CurrenciesController.prototype.getTickers = function getTickers(req, res) {
		Currencies.find({
			visible: true
		}, { _id: 0, exchanges: 0, indexes: 0 }).sort({ rank: -1 }).lean().then(function (currencies) {
			res.cjson({ success: true, tickers: currencies.map(function (currency) {
					return (0, _assign2.default)({ currency: currency.currency }, currency.ticker);
				}) });
		});
	};

	CurrenciesController.prototype.getTicker = function getTicker(req, res) {
		var currencyName = req.params.currency;
		Currencies.findOne({
			visible: true,
			currency: currencyName
		}, { _id: 0, exchanges: 0, indexes: 0 }).sort({ rank: -1 }).lean().then(function (currency) {
			res.cjson({ success: true, ticker: (0, _assign2.default)({ currency: currency.currency }, currency.ticker) });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	// Searches for a currency


	CurrenciesController.prototype.search = function search(req, res) {
		var search = req.body.search;
		var searchQuery = {};
		if (search && search.length > 0) {
			var searchTags = search.split(" ");
			searchQuery = [];
			for (var _iterator = searchTags, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
				var _ref;

				if (_isArray) {
					if (_i >= _iterator.length) break;
					_ref = _iterator[_i++];
				} else {
					_i = _iterator.next();
					if (_i.done) break;
					_ref = _i.value;
				}

				var tag = _ref;

				searchQuery.push({
					symbol: {
						$regex: tag,
						$options: "i"
					}
				}, {
					currencies: {
						$regex: tag,
						$options: "i"
					}
				}, {
					name: {
						$regex: tag,
						$options: "i"
					}
				});
			}
			Currencies.find({
				$or: searchQuery,
				visible: true
			}, {
				_id: 0,
				exchanges: 0,
				indexes: 0,
				ticker: 0
			}).sort({ rank: -1 }).limit(25).lean().then(function (currencies) {
				res.json({ success: true, currencies: currencies });
			}).catch(function (error) {
				res.serverError(error);
			});
		} else {
			res.json({ success: true, currencies: [] });
		}
	};

	CurrenciesController.prototype.getHistory = function getHistory(req, res) {
		var currency = req.params.currency;
		var startTime = parseFloat(req.params.startTime);
		var endTime = parseFloat(req.params.endTime);
		var interval = parseFloat(req.params.interval);
		var index = req.params.index;
		if (endTime <= 0) {
			endTime = Date.now();
		}

		var stat = new Date();
		var startDate = new Date(startTime);
		var endDate = new Date(endTime);
		var Query = {};
		Query[index] = "$avg";
		MarketData.getMetrics("nkr", currency, startDate, endDate, interval, Query).then(function (documents) {

			for (var _iterator2 = documents, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);;) {
				var _ref2;

				if (_isArray2) {
					if (_i2 >= _iterator2.length) break;
					_ref2 = _iterator2[_i2++];
				} else {
					_i2 = _iterator2.next();
					if (_i2.done) break;
					_ref2 = _i2.value;
				}

				var doc = _ref2;

				doc.date = new Date(doc.timestamp);
			}
			res.cjson({
				success: true,
				dates: {
					startDate: startDate,
					endDate: endDate,
					interval: interval
				},
				currency: currency,
				queryTime: (Date.now() - stat.getTime()) / 1000,
				history: documents
			});
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	CurrenciesController.prototype.getChanges = function getChanges(req, res) {
		var startTime = parseFloat(req.params.startTime);
		var endTime = parseFloat(req.params.endTime);
		var interval = parseFloat(req.params.interval);
		var metric = req.params.metric;
		var direction = parseInt(req.params.direction);
		if (endTime <= 0) {
			endTime = Date.now();
		}
		var startDate = new Date(startTime);
		var endDate = new Date(endTime);

		var stat = new Date();
		// Get Change
		MarketData.getMetricsChange({
			exchange: "nkr"
		}, startDate, endDate, interval, metric, direction).then(function (documents) {
			res.cjson({
				success: true,
				metric: metric,
				dates: {
					startDate: startDate,
					endDate: endDate,
					interval: interval
				},
				queryTime: (Date.now() - stat.getTime()) / 1000,
				changes: documents
			});
		});
	};

	CurrenciesController.prototype.getVolumeRankings = function getVolumeRankings(req, res) {
		var startTime = parseFloat(req.params.startTime);
		var endTime = parseFloat(req.params.endTime);
		var interval = parseFloat(req.params.interval);
		var metric = req.params.metric;
		var direction = parseInt(req.params.direction);
		if (endTime <= 0) {
			endTime = Date.now();
		}
		var startDate = new Date(startTime);
		var endDate = new Date(endTime);

		var stat = new Date();
		// Get Change
		MarketData.getMetricsAvgTotals({
			exchange: "nkr"
		}, startDate, endDate, interval, "Volume", direction).then(function (documents) {
			res.cjson({
				success: true,
				metric: metric,
				dates: {
					startDate: startDate,
					endDate: endDate,
					interval: interval
				},
				queryTime: (Date.now() - stat.getTime()) / 1000,
				rankings: documents
			});
		});
	};

	return CurrenciesController;
}(), (_applyDecoratedDescriptor(_class2.prototype, "index", [_dec2, _dec3, _dec4], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "index"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getSorted", [_dec5, _dec6], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getSorted"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getRates", [_dec7, _dec8], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getRates"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getCurrency", [_dec9, _dec10], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getCurrency"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getTickers", [_dec11, _dec12], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getTickers"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getTicker", [_dec13, _dec14], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getTicker"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "search", [_dec15], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "search"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getHistory", [_dec16, _dec17], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getHistory"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getChanges", [_dec18, _dec19], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getChanges"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getVolumeRankings", [_dec20, _dec21], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getVolumeRankings"), _class2.prototype)), _class2)) || _class);
;