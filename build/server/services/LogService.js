"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LogService = Service(_class = function () {
	function LogService() {
		(0, _classCallCheck3.default)(this, LogService);
	}

	LogService.log = function log(logType) {
		var logData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Logs.create({
			logType: logType,
			logData: logData
		});
	};

	return LogService;
}()) || _class;

;