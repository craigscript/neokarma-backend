"use strict";

exports.__esModule = true;

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (params) {
	var filters = [];
	for (var _iterator = params.words, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
		var _ref;

		if (_isArray) {
			if (_i >= _iterator.length) break;
			_ref = _iterator[_i++];
		} else {
			_i = _iterator.next();
			if (_i.done) break;
			_ref = _i.value;
		}

		var word = _ref;

		filters.push({
			$match: {
				$or: [{
					$gte: [{
						$indexOfBytes: ["$content", word]
					}, 0]
				}, {
					$gte: [{
						$indexOfBytes: ["$title", word]
					}, 0]
				}]
			}
		});
	}
	return filters;
};