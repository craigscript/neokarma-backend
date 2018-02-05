"use strict";

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _desc, _value, _class2;

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

var MarketListController = (_dec = Controller("/portfolio", ["Auth"]), _dec2 = GET("/"), _dec3 = GET("/getPrimary"), _dec4 = GET("/getPortfolio/:portfolioId"), _dec5 = GET("/getPortfolioHistory/:listId/:start/:end/:interval"), _dec6 = POST("/updatePortfolio/:portfolioId"), _dec7 = POST("/createPortfolio"), _dec(_class = (_class2 = function () {
	function MarketListController() {
		(0, _classCallCheck3.default)(this, MarketListController);
	}

	MarketListController.prototype.getPrimary = function getPrimary(req, res) {
		Portfolios.findOne({ user: req.user._id }).lean().then(function (portfolio) {
			return res.json({ success: true, portfolio: portfolio });
		}).catch(function (error) {
			return res.serverError(error);
		});
	};

	MarketListController.prototype.getPortfolio = function getPortfolio(req, res) {
		var portfolioId = req.params.portfolioId;
		Portfolios.findOne({ _id: portfolioId }).lean().then(function (portfolio) {
			return res.json({ success: true, portfolio: portfolio });
		}).catch(function (error) {
			return res.serverError(error);
		});
	};

	// Returns wallet history


	MarketListController.prototype.getWalletHistory = function getWalletHistory(req, res) {
		return res.error({ message: "Not implemented" });
	};

	// Adds a card to the user's list


	MarketListController.prototype.updatePortfolio = function updatePortfolio(req, res) {
		var portfolioId = req.params.portfolioId;
		var cards = req.body.cards;
		var holdings = req.body.holdings;
		Portfolios.update({
			_id: portfolioId,
			user: req.user._id
		}, {
			cards: cards,
			holdings: holdings
		}).then(function (result) {
			return res.json({ success: true });
		});
	};

	// Adds a card to the user's list


	MarketListController.prototype.createPortfolio = function createPortfolio(req, res) {
		var cards = req.body.cards;
		console.log("cards:", cards);
		var holdings = req.body.holdings;
		Portfolios.create({
			name: "My Portfolio",
			user: req.user._id,
			cards: cards,
			holdings: holdings,
			wallet: { Total: 0, Change24H: 0, Earned: 0 }
		}).then(function (portfolio) {
			return res.json({ success: true, portfolio: portfolio });
		});
	};

	return MarketListController;
}(), (_applyDecoratedDescriptor(_class2.prototype, "getPrimary", [_dec2, _dec3], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getPrimary"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getPortfolio", [_dec4], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getPortfolio"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getWalletHistory", [_dec5], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getWalletHistory"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "updatePortfolio", [_dec6], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "updatePortfolio"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "createPortfolio", [_dec7], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "createPortfolio"), _class2.prototype)), _class2)) || _class);
;