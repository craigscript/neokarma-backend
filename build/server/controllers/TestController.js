"use strict";

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _desc, _value, _class2;

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

var TestsController = (_dec = Controller("/tests"), _dec2 = GET("/emailTest"), _dec3 = GET("/quotaset"), _dec4 = GET("/quotaval"), _dec5 = GET("/quotaup"), _dec6 = GET("/quotadown"), _dec7 = GET("/quotaDecorator"), _dec8 = GET("/quotaCheck"), _dec(_class = (_class2 = function () {
	function TestsController() {
		(0, _classCallCheck3.default)(this, TestsController);
	}

	TestsController.prototype.emailTest = function emailTest(req, res) {

		// var mail = new Email(["azarusx@gmail.com"], "Welcome to Neokarma!");
		// mail.setTemplate("emails/user-signup-track", {
		// 	url: Config.site.url,
		// 	emailToken: "123",
		// 	email: "azarusx@gmail.com",
		// 	password: "test123",
		// });
		// mail.send(() =>
		// {
		// 	console.log("Email sent.");
		// });
		//return res.json({ success: true, confirm: false });
		var mail = new Email(["azarusx@gmail.com"], "How are you?");
		mail.setTemplate("emails/test");
		mail.setContent("Hi there!");
		mail.send(function (response) {
			console.log("Email sent:", response);
			res.json({ success: true });
		});
	};

	TestsController.prototype.quotaset = function quotaset(req, res) {
		res.json({ success: UserQuota.setQuota(req.user, "asd.xd", 1, 10), quotas: req.user.quotas });
	};

	TestsController.prototype.quotaval = function quotaval(req, res) {
		res.json({ success: UserQuota.validate(req.user, "asd.xd", 1), quotas: req.user.quotas });
	};

	TestsController.prototype.quotaup = function quotaup(req, res) {
		res.json({ success: UserQuota.update(req.user, "asd.xd", 1), quotas: req.user.quotas });
	};

	TestsController.prototype.quotadown = function quotadown(req, res) {
		res.json({ success: UserQuota.update(req.user, "asd.xd", -1), quotas: req.user.quotas });
	};

	//@Quota("mention.limit")


	TestsController.prototype.quotaCheck = function quotaCheck(req, res) {
		UserQuota.Increment(req.user, "mention.limit");
		res.json({ success: true });
	};

	TestsController.prototype.quotaCheck = function quotaCheck(req, res) {
		UserQuota.Increment(req.user, "mention.limit");

		if (!UserQuota.isAllowed(req.user, "mention.limit")) {
			return res.json({ success: false, message: "Mention limit quota reached." });
		}

		res.json({ success: true });
	};

	return TestsController;
}(), (_applyDecoratedDescriptor(_class2.prototype, "emailTest", [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "emailTest"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "quotaset", [_dec3], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "quotaset"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "quotaval", [_dec4], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "quotaval"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "quotaup", [_dec5], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "quotaup"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "quotadown", [_dec6], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "quotadown"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "quotaCheck", [_dec7], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "quotaCheck"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "quotaCheck", [_dec8], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "quotaCheck"), _class2.prototype)), _class2)) || _class);
;