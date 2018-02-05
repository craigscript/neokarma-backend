"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ACLPolicy = (_dec = Policy("ACL"), _dec(_class = function () {
	function ACLPolicy() {
		(0, _classCallCheck3.default)(this, ACLPolicy);
	}

	ACLPolicy.prototype.route = function route(req, res, next) {

		next();
	};

	return ACLPolicy;
}()) || _class);
;