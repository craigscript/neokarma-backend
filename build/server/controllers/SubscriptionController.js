"use strict";

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _class, _desc, _value, _class2;

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

var tokenGenerator = require('generate-password');

var SubscriptionController = (_dec = Controller("/subscription"), _dec2 = GET("/getPlans"), _dec3 = GET("/getPaymentMethods"), _dec4 = GET("/getUpgradePlan/:planId"), _dec5 = GET("/executeTrial/:planId"), _dec6 = POST("/createPayment/:planId/:gateway"), _dec7 = POST("/createSubscription/:planId/:gateway"), _dec8 = POST("/executeSubscription/:paymentId"), _dec9 = ANY("/ipn/:paymentToken"), _dec10 = GET("/getPayment/:paymentId"), _dec11 = GET("/getPayments"), _dec12 = POST("/cancelSubscription"), _dec(_class = (_class2 = function () {
	function SubscriptionController() {
		(0, _classCallCheck3.default)(this, SubscriptionController);
	}

	SubscriptionController.prototype.getPlans = function getPlans(req, res) {
		SubscriptionPlans.find().then(function (plans) {
			res.json({ success: true, plans: plans });
		});
	};

	// Returns all the payment methods


	SubscriptionController.prototype.getPaymentMethods = function getPaymentMethods(req, res) {
		var gateways = PaymentService.getGateways();
		var paymentMethods = [];
		for (var _iterator = gateways, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var gateway = _ref;

			var methods = gateway.getPaymentMethods();
			for (var _iterator2 = methods, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);;) {
				var _ref2;

				if (_isArray2) {
					if (_i2 >= _iterator2.length) break;
					_ref2 = _iterator2[_i2++];
				} else {
					_i2 = _iterator2.next();
					if (_i2.done) break;
					_ref2 = _i2.value;
				}

				var method = _ref2;

				paymentMethods.push(method);
			}
		}

		res.json({ success: true, paymentMethods: paymentMethods });
	};

	// Returns the upgrade plan description and prices based on the current plan. If theres any.


	SubscriptionController.prototype.getUpgradePlan = function getUpgradePlan(req, res) {
		var planId = req.params.planId;
		SubscriptionPlans.findOne({ _id: planId }).then(function (plan) {
			if (!plan) {
				return res.json({ success: false, message: "No such plan." });
			}
			res.json({ success: true, plan: plan });
		}).catch(function (error) {

			res.serverError(error);
		});
	};

	// Creates a payment to fund a plan ONCE


	SubscriptionController.prototype.executeTrial = function executeTrial(req, res) {
		var planId = req.params.planId;

		console.log("user:", req.user);
		if (req.user.subscription) {
			return res.json({ success: false, message: "Subscription already active." });
		}
		console.log("subscription:", req.user.subscription);
		SubscriptionPlans.findOne({ _id: planId }).then(function (plan) {
			if (!plan.trial) {
				return res.json({ success: false, message: "Selected plan is not trial" });
			}
			console.log("Found plan:", plan);
			SubscriptionService.createSubscription(req.user._id, plan).then(function () {
				return res.json({ success: true });
			});
		});
	};
	// Creates a payment to fund a plan ONCE


	SubscriptionController.prototype.createPayment = function createPayment(req, res) {
		var planId = req.params.planId;
		var gatewayName = req.params.gateway;
		var paymentOptions = req.body.paymentOptions;

		SubscriptionPlans.findOne({ _id: planId }).then(function (plan) {

			if (!plan) {
				return res.json({ success: false, message: "Invalid plan" });
			}

			var gateway = PaymentService.CreateGateway(gatewayName);
			if (!gateway) {
				return res.json({ success: false, message: "Invalid gateway." });
			}

			var paymentToken = tokenGenerator.generate({
				length: 10,
				numbers: true
			});

			UserPayment.create({
				paymentToken: paymentToken,
				user: req.user._id,
				name: plan.name,
				price: plan.price,
				currency: plan.currency,
				gateway: gatewayName,
				status: "InProgress",
				plan: plan,
				expires: Date.now() + 60 * 60 * 2 * 1000 // Expire in 1 hours
			}).then(function (payment) {

				gateway.createIPNTransaction({
					name: plan.name,
					description: plan.description,
					currency: plan.currency,
					targetCurrency: paymentOptions.targetCurrency,
					amount: plan.price,
					ipnURL: Config.site.serverUrl + "/subscription/ipn/" + paymentToken
				}).then(function (transaction) {

					payment.transaction = transaction;
					payment.save();

					res.json({
						success: true,
						payment: payment.toJSON()
					});
				}).catch(function (error) {
					payment.remove();
					console.log("[TransactionError]:", error, error.details);
					res.json({
						success: false,
						message: "Failed to start transaction",
						error: error
					});
				});
			}).catch(function (error) {
				res.serverError(error);
			});
		}).catch(function (error) {

			res.serverError(error);
		});
	};

	// Creates a subscription to fund a plan until the subscription is canceled.


	SubscriptionController.prototype.createSubscription = function createSubscription(req, res) {
		var planId = req.params.planId;
		var gatewayName = req.params.gateway;
		//let paymentOptions = req.body.paymentOptions;
		//let currency = paymentOptions.currency;

		SubscriptionPlans.findOne({ _id: planId }).then(function (plan) {

			if (!plan) {
				return res.json({ success: false, message: "Invalid plan" });
			}

			var gateway = PaymentService.CreateGateway(gatewayName);
			if (!gateway) {
				return res.json({ success: false, message: "Invalid gateway." });
			}

			var paymentToken = tokenGenerator.generate({
				length: 10,
				numbers: true
			});

			UserPayment.create({
				paymentToken: paymentToken,
				user: req.user._id,
				name: plan.name,
				price: plan.price,
				currency: plan.currency,
				gateway: gatewayName,
				status: "InProgress",
				plan: plan,
				expires: Date.now() + 60 * 60 * 2 * 1000 // Expire in 1 hours
			}).then(function (payment) {
				gateway.createSubscription({
					name: plan.name,
					description: plan.description,
					currency: plan.currency,
					interval: 31,
					frequency: "DAY",
					amount: plan.price,
					cancelURL: Config.paypal.getCancelURL(payment),
					returnURL: Config.paypal.getReturnURL(payment)

				}).then(function (transaction) {

					payment.transaction = transaction;
					payment.save();

					res.json({
						success: true,
						payment: payment.toJSON()
					});
				}).catch(function (error) {
					//console.log("[TransactionError]:", error,  error.details);
					res.json({
						success: false,
						message: "Failed to start transaction",
						error: error
					});
				});
			}).catch(function (error) {
				res.serverError(error);
			});
		}).catch(function (error) {

			res.serverError(error);
		});
	};

	// Callback to execute the subscription after its initialized.


	SubscriptionController.prototype.executeSubscription = function executeSubscription(req, res) {
		var paymentId = req.params.paymentId;
		UserPayment.findOne({
			_id: paymentId,
			user: req.user._id
		}).then(function (payment) {

			if (!payment) return res.json({ success: false, message: "Invalid paymentId" });

			var gateway = PaymentService.CreateGateway(payment.gateway);
			gateway.executeSubscription(payment.transaction).then(function (subscription) {

				payment.status = 'Paid';
				payment.save();
				SubscriptionService.createSubscription(req.user._id, payment.plan).then(function () {
					res.json({ success: true, payment: payment, transaction: subscription });
				});
			}).catch(function (error) {
				console.log("error:", error);
				res.json({ success: false, message: "Failed to finish payment." });
			});
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	// IPN Service


	SubscriptionController.prototype.instantPaymentNotification = function instantPaymentNotification(req, res) {
		var paymentToken = req.params.paymentToken;

		console.log("[IPN] Body:", req.body.status, req.body.status_text);

		UserPayment.findOne({
			paymentToken: paymentToken
		}).then(function (payment) {

			if (!payment) return res.json({ success: false });

			var gateway = PaymentService.CreateGateway(payment.gateway);
			if (!gateway) {
				return res.json({ success: false, message: "Invalid gateway." });
			}

			gateway.handleIPN(req, res).then(function (result) {
				// Check if the required information is the same.
				if (result.success) {

					console.log("Payment confirmed!", result, payment.status);
					SubscriptionService.createSubscription(payment.user, payment.plan).then(function () {
						payment.status = "Paid";
						payment.paid = Date.now();
						payment.save();
					});
					return res.json({
						success: true
					});
				}

				if (result.failed) {
					payment.status = "Failed";
					payment.save();
				}

				if (result.pending) {
					payment.status = "Pending";
					payment.save();
				}
				console.log("Payment failed:", result.message);
				res.json(result);
			});
		});
	};

	// Returns a single payment description


	SubscriptionController.prototype.getPayment = function getPayment(req, res) {
		var paymentId = req.params.paymentId;

		UserPayment.findOne({
			_id: paymentId,
			user: req.user._id
		}).then(function (payment) {

			if (!payment) return res.json({ success: false, message: "Invalid paymentId" });

			res.json({ success: true, payment: payment.toJSON() });
		}).catch(function (error) {
			res.serverError(error);
		});
	};

	// Returns the payments made by the current user


	SubscriptionController.prototype.getPayments = function getPayments(req, res) {
		UserPayment.find({
			user: req.user._id
		}).sort({ created: -1 }).then(function (payments) {

			res.json({ success: true, payments: payments });
		}).catch(function (error) {
			res.serverError(error);
		});

		//	res.json({success: false, message: "Not implemented"});
	};

	// Cancels the current user subscription.


	SubscriptionController.prototype.cancelSubscription = function cancelSubscription(req, res) {
		res.json({ success: false, message: "Not implemented" });
	};

	return SubscriptionController;
}(), (_applyDecoratedDescriptor(_class2.prototype, "getPlans", [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getPlans"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getPaymentMethods", [_dec3], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getPaymentMethods"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getUpgradePlan", [_dec4], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getUpgradePlan"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "executeTrial", [_dec5], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "executeTrial"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "createPayment", [_dec6], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "createPayment"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "createSubscription", [_dec7], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "createSubscription"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "executeSubscription", [_dec8], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "executeSubscription"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "instantPaymentNotification", [_dec9], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "instantPaymentNotification"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getPayment", [_dec10], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getPayment"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getPayments", [_dec11], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "getPayments"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "cancelSubscription", [_dec12], (0, _getOwnPropertyDescriptor2.default)(_class2.prototype, "cancelSubscription"), _class2.prototype)), _class2)) || _class);
;