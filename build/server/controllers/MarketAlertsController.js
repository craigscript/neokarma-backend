"use strict";

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _desc, _value, _class2;

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

var MarketAlertsController = (_dec = Controller("/market/alerts"), _dec2 = AuthRequired({ success: true, alerts: [] }), _dec3 = GET("/"), _dec4 = AuthRequired({ success: true, alerts: [] }), _dec5 = GET("/market/:MarketName"), _dec6 = AuthRequired(), _dec7 = POST("/createAlert"), _dec8 = AuthRequired(), _dec9 = POST("/updateAlert/:alertId"), _dec10 = AuthRequired(), _dec11 = GET("/removeAlert/:alertId"), _dec(_class = (_class2 = function () {
	function MarketAlertsController() {
		(0, _classCallCheck3.default)(this, MarketAlertsController);
	}

	MarketAlertsController.prototype.getAlerts = function getAlerts(req, res) {
		MarketAlerts.find({ userId: req.user._id }).lean().then(function (alerts) {
			res.json({ success: true, alerts: alerts });
		});
	};

	MarketAlertsController.prototype.getMarketAlerts = function getMarketAlerts(req, res) {
		var MarketName = req.params.MarketName;
		MarketAlerts.find({ userId: req.user._id, market: MarketName }).lean().then(function (alerts) {
			res.json({ success: true, alerts: alerts });
		});
	};

	// Creates an alert


	MarketAlertsController.prototype.createAlert = function createAlert(req, res) {
		var alertName = req.body.name;
		var market = req.body.market;
		var alarmStrategy = req.body.alarmStrategy;
		var alarmOptions = req.body.alarmOptions;

		MarketAlerts.create({
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

	// Creates an alert


	MarketAlertsController.prototype.updateAlert = function updateAlert(req, res) {
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

	MarketAlertsController.prototype.removeAlert = function removeAlert(req, res) {
		MarketAlerts.remove({
			userId: req.user._id,
			_id: req.params.alertId
		}).then(function () {
			res.json({ success: true });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	return MarketAlertsController;
}(), (_applyDecoratedDescriptor(_class2.prototype, "getAlerts", [_dec2, _dec3], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getAlerts"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getMarketAlerts", [_dec4, _dec5], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getMarketAlerts"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "createAlert", [_dec6, _dec7], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "createAlert"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "updateAlert", [_dec8, _dec9], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "updateAlert"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "removeAlert", [_dec10, _dec11], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "removeAlert"), _class2.prototype)), _class2)) || _class);
;