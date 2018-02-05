"use strict";

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _desc, _value, _class2;

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

var CurrencyAlertsController = (_dec = Controller("/currencies/alerts", ["Auth"]), _dec2 = GET("/"), _dec3 = GET("/getAlerts/:currency"), _dec4 = POST("/createAlert"), _dec5 = AuthRequired(), _dec6 = POST("/updateAlert/:alertId"), _dec7 = AuthRequired(), _dec8 = GET("/removeAlert/:alertId"), _dec(_class = (_class2 = function () {
	function CurrencyAlertsController() {
		(0, _classCallCheck3.default)(this, CurrencyAlertsController);
	}

	CurrencyAlertsController.prototype.index = function index(req, res) {
		MarketAlerts.find({ userId: req.user._id }).lean().then(function (alerts) {
			res.json({ success: true, alerts: alerts });
		});
	};

	CurrencyAlertsController.prototype.getAlerts = function getAlerts(req, res) {
		var currency = req.params.currency;
		MarketAlerts.find({ userId: req.user._id, exchange: "nkr", market: currency }).lean().then(function (alerts) {
			res.json({ success: true, alerts: alerts });
		});
	};

	CurrencyAlertsController.prototype.createAlert = function createAlert(req, res) {
		var alertName = req.body.name;
		var currency = req.body.currency;
		var alarmStrategy = req.body.alarmStrategy;
		var alarmOptions = req.body.alarmOptions;

		MarketAlerts.create({
			userId: req.user._id,
			name: alertName,
			exchange: "nkr",
			market: currency,
			alarmStrategy: alarmStrategy,
			alarmOptions: alarmOptions,
			target: "email",
			targetOptions: {
				address: req.user.email
			},
			canTrigger: true
		}).then(function (alert) {
			res.json({ success: true, alert: alert });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	// Creates an alert


	CurrencyAlertsController.prototype.updateAlert = function updateAlert(req, res) {
		var alertName = req.body.name;
		var market = req.body.market;
		var alarmStrategy = req.body.alarmStrategy;
		var alarmOptions = req.body.alarmOptions;

		MarketAlerts.update({
			_id: req.params.alertId
		}, {
			userId: req.user._id,
			name: alertName,
			market: market,
			alarmStrategy: alarmStrategy,
			alarmOptions: alarmOptions,
			target: "email",
			targetOptions: {
				address: req.user.email
			},
			canTrigger: true
		}).then(function (alert) {
			res.json({ success: true, alert: alert });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	CurrencyAlertsController.prototype.removeAlert = function removeAlert(req, res) {
		MarketAlerts.remove({
			userId: req.user._id,
			_id: req.params.alertId
		}).then(function () {
			res.json({ success: true });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	return CurrencyAlertsController;
}(), (_applyDecoratedDescriptor(_class2.prototype, "index", [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "index"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getAlerts", [_dec3], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getAlerts"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "createAlert", [_dec4], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "createAlert"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "updateAlert", [_dec5, _dec6], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "updateAlert"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "removeAlert", [_dec7, _dec8], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "removeAlert"), _class2.prototype)), _class2)) || _class);
;