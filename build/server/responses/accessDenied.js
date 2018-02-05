"use strict";

exports.__esModule = true;
exports.default = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AccessDeniedResponse = (_dec = Response("accessDenied"), _dec(_class = function () {
	function AccessDeniedResponse() {
		(0, _classCallCheck3.default)(this, AccessDeniedResponse);
	}

	AccessDeniedResponse.prototype.index = function index(req, res) {
		console.log("403 Access Denied: ", req.url);
		res.status(403);
		res.json({ success: false, login_required: true, message: "Access denied, please log in!" });
	};

	return AccessDeniedResponse;
}()) || _class);
exports.default = AccessDeniedResponse;