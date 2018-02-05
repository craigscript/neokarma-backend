"use strict";

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _desc, _value, _class2;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}

var os = require("os");
var AdminController = (_dec = Controller("/admin"), _dec2 = GET("/"), _dec3 = ACL(["Admin"]), _dec4 = GET("/status"), _dec5 = ACL(["Admin", "Admin.Status"]), _dec6 = GET("/console"), _dec7 = ACL(["Admin", "Admin.System.Console"]), _dec(_class = (_class2 = function () {
	function AdminController() {
		(0, _classCallCheck3.default)(this, AdminController);
	}

	AdminController.prototype.index = function index(req, res) {
		res.json({ success: true });
	};

	AdminController.prototype.status = function status(req, res) {
		// db.query("SHOW GLOBAL STATUS").then(function(result)
		// {
		// 	console.log("SQL Status:", result);
		// });
		res.json({ success: true,
			status: {
				cpus: os.cpus(),
				loadavg: os.loadavg(),

				arch: os.arch(),
				ostype: os.type(),
				platform: os.platform(),

				totalmem: os.totalmem(),
				freemem: os.freemem(),

				network: os.networkInterfaces(),
				uptime: os.uptime()
			}
		});
	};

	AdminController.prototype.console = function console(req, res) {
		res.json({ success: true });
	};

	return AdminController;
}(), (_applyDecoratedDescriptor(_class2.prototype, "index", [_dec2, _dec3], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "index"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "status", [_dec4, _dec5], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "status"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "console", [_dec6, _dec7], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "console"), _class2.prototype)), _class2)) || _class);
;