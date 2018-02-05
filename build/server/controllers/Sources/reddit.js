"use strict";

exports.__esModule = true;
exports.default = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RedditSource = function () {
	function RedditSource() {
		(0, _classCallCheck3.default)(this, RedditSource);
	}

	RedditSource.prototype.getSourceOptions = function getSourceOptions(req, res) {
		return res.json({ success: true, subreddits: [], format: "/r/*" });
	};

	return RedditSource;
}();

exports.default = RedditSource;