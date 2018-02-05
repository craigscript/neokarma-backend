"use strict";

exports.__esModule = true;
exports.default = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TwitterSource = function () {
	function TwitterSource() {
		(0, _classCallCheck3.default)(this, TwitterSource);
	}

	TwitterSource.prototype.getSourceOptions = function getSourceOptions(req, res) {
		return TwitterTopics.find().then(function (topics) {
			return res.json({ success: true, topics: topics.map(function (topic) {
					return topic.topic;
				}) });
		});
	};

	return TwitterSource;
}();

exports.default = TwitterSource;