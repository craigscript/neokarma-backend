"use strict";

exports.__esModule = true;

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (params) {
	console.log("Word filter is used:", params);
	var filters = [];
	var words = params.words.split(",");
	console.log("Word filter words:", words);
	var contains = [];
	for (var _iterator = words, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
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

		// All of them needs to exists
		if (params.mode == "Match") {
			filters.push({ $match: { content: { $regex: word, $options: 'i' } } });
		}

		// All of them needs to exclude
		if (params.mode == "Dont Match") {
			filters.push({ $match: { content: { $not: word, $options: 'i' } } });
		}

		// At least one needs to exists
		if (params.mode == "Contain") {
			contains.push({ content: { $regex: word, $options: 'i' } });
		}

		// At least one needs to exclude
		if (params.mode == "Do not Contain") {
			contains.push({ content: { $not: word, $options: 'i' } });
		}
	}

	if (params.mode == "Contain") {
		filters.push({
			$match: {
				$or: contains
			}
		});
	}

	return filters;
};