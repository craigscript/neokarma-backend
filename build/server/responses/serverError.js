"use strict";

exports.__esModule = true;
exports.default = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ServerErrorResponse = (_dec = Response("serverError"), _dec(_class = function () {
	function ServerErrorResponse() {
		(0, _classCallCheck3.default)(this, ServerErrorResponse);
	}

	ServerErrorResponse.prototype.index = function index(req, res, error) {
		console.log("[SERVER ERROR]:", error);
		res.status(500);
		res.json({ success: false, error: true, message: "Server Errror" });

		//console.error(err.stack);
	};

	return ServerErrorResponse;
}()) || _class);
exports.default = ServerErrorResponse;