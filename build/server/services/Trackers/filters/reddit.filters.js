"use strict";

exports.__esModule = true;
exports.RedditFilters = undefined;

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _dec2, _desc, _value, _class;

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

var RedditFilters = exports.RedditFilters = (_dec = TrackerFilter("username"), _dec2 = TrackerFilter("keyword"), (_class = function () {
	function RedditFilters() {
		(0, _classCallCheck3.default)(this, RedditFilters);
	}

	RedditFilters.prototype.usernameFilter = function usernameFilter(stream, params) {
		stream.filter({
			$match: {
				username: { $contains: params.name }
			}
		});
	};

	RedditFilters.prototype.keywordFilter = function keywordFilter(stream, params) {
		stream.filter({
			$match: {
				content: { $contains: params.keywords }
			}
		});
	};

	return RedditFilters;
}(), (_applyDecoratedDescriptor(_class.prototype, "usernameFilter", [_dec], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, "usernameFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "keywordFilter", [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, "keywordFilter"), _class.prototype)), _class));