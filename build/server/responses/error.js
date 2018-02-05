"use strict";

exports.__esModule = true;
exports.default = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ErrorResponse = (_dec = Response("error"), _dec(_class = function () {
	function ErrorResponse() {
		(0, _classCallCheck3.default)(this, ErrorResponse);
	}

	ErrorResponse.prototype.index = function index(req, res, message) {
		console.log("400 Bad request:", req.url, "Message:", message);
		res.status(400);
		res.json({ success: false, message: message });
	};

	return ErrorResponse;
}()) || _class);
exports.default = ErrorResponse;