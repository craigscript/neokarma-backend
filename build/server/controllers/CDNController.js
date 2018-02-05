"use strict";

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _class3, _temp;

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

var CDNController = (_dec = Controller("/cdn"), _dec2 = GET("/cacheTest"), _dec3 = GET("/health"), _dec(_class = (_class2 = (_temp = _class3 = function () {
	function CDNController() {
		(0, _classCallCheck3.default)(this, CDNController);
	}

	CDNController.prototype.cacheTest = function cacheTest(req, res) {
		res.json({
			success: true,
			random: Math.random() * 1000,
			lastUpdate: CDNController._LastCacheTime
		});
		CDNController._LastCacheTime = new Date();
	};

	CDNController.prototype.health = function health(req, res) {
		res.json({
			success: true,
			lastCheck: CDNController._LastHealthCheckTime,
			result: "stil alive"
		});
		CDNController._LastHealthCheckTime = new Date();
	};

	return CDNController;
}(), _class3._LastCacheTime = new Date(), _class3._LastHealthCheckTime = new Date(), _temp), (_applyDecoratedDescriptor(_class2.prototype, "cacheTest", [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "cacheTest"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "health", [_dec3], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "health"), _class2.prototype)), _class2)) || _class);
;