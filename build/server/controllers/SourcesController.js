"use strict";

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _dec2, _dec3, _class, _desc, _value, _class2;

var _market = require("./Sources/market.js");

var _market2 = _interopRequireDefault(_market);

var _reddit = require("./Sources/reddit.js");

var _reddit2 = _interopRequireDefault(_reddit);

var _twitter = require("./Sources/twitter.js");

var _twitter2 = _interopRequireDefault(_twitter);

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

var Sources = {
	market: _market2.default,
	reddit: _reddit2.default,
	twitter: _twitter2.default
};
(0, _freeze2.default)(Sources);
var SourcesController = (_dec = Controller("/sources"), _dec2 = GET("/getSources"), _dec3 = GET("/getSourceOptions/:type"), _dec(_class = (_class2 = function () {
	function SourcesController() {
		(0, _classCallCheck3.default)(this, SourcesController);
	}

	SourcesController.prototype.getSources = function getSources(req, res) {
		return res.json({
			success: true,
			sources: ["reddit", "twitter", "market"]
		});
	};

	SourcesController.prototype.getSourceOptions = function getSourceOptions(req, res) {
		var type = req.params.type;

		if (!Sources[type]) return res.json({ success: false, message: "Source not found" });
		var source = new Sources[type]();
		return source.getSourceOptions(req, res);
	};

	return SourcesController;
}(), (_applyDecoratedDescriptor(_class2.prototype, "getSources", [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getSources"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getSourceOptions", [_dec3], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getSourceOptions"), _class2.prototype)), _class2)) || _class);
;