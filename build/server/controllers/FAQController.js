"use strict";

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _dec2, _class, _desc, _value, _class2;

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

var FAQController = (_dec = Controller("/faq"), _dec2 = GET("/"), _dec(_class = (_class2 = function () {
	function FAQController() {
		(0, _classCallCheck3.default)(this, FAQController);
	}

	FAQController.prototype.getFaq = function getFaq(req, res) {
		res.json({
			success: true,
			qa: [{
				question: "How are you?",
				answer: "I am fine, so lets go with lorem impsum!"
			}, {
				question: "How are you?",
				answer: "I am fine, so lets go with lorem impsum!"
			}, {
				question: "How are you?",
				answer: "I am fine, so lets go with lorem impsum!"
			}]
		});
	};

	return FAQController;
}(), (_applyDecoratedDescriptor(_class2.prototype, "getFaq", [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getFaq"), _class2.prototype)), _class2)) || _class);
;