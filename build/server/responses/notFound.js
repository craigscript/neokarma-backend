"use strict";

exports.__esModule = true;
exports.default = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NotFoundResponse = (_dec = Response("notFound"), _dec(_class = function () {
	function NotFoundResponse() {
		(0, _classCallCheck3.default)(this, NotFoundResponse);
	}

	NotFoundResponse.prototype.index = function index(req, res) {
		console.log("404 Not found: ", req.url);
		res.status(404);
		res.json({ success: false, not_found: true, message: "Not Found" });
	};

	return NotFoundResponse;
}()) || _class);
exports.default = NotFoundResponse;