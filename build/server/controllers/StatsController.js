"use strict";

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _dec2, _dec3, _class, _desc, _value, _class2;

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

var StatsController = (_dec = Controller("/stats"), _dec2 = GET("/"), _dec3 = GET("/getTrackings"), _dec(_class = (_class2 = function () {
	function StatsController() {
		(0, _classCallCheck3.default)(this, StatsController);
	}

	StatsController.prototype.index = function index(req, res) {
		res.json({ success: true });
	};

	StatsController.prototype.getTrackings = function getTrackings(req, res) {
		TrackingStats.find().sort({ target: -1, updatedAt: -1 }).then(function (trackings) {
			res.json({ success: true, trackings: trackings });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	return StatsController;
}(), (_applyDecoratedDescriptor(_class2.prototype, "index", [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "index"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getTrackings", [_dec3], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getTrackings"), _class2.prototype)), _class2)) || _class);
;