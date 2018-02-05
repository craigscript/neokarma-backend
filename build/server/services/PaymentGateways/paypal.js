"use strict";

exports.__esModule = true;
exports.default = undefined;

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _Subscription = require("./paypal/Subscription.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var paypalSDK = require("paypal-rest-sdk");

var PaypalGateway = function () {
	function PaypalGateway() {
		(0, _classCallCheck3.default)(this, PaypalGateway);

		paypalSDK.configure(Config.paypal.options);
	}

	PaypalGateway.prototype.getPaymentMethods = function getPaymentMethods() {
		return [{
			name: "Paypal",
			currencies: ["USD", "EUR"],
			gateway: "paypal"
		}];
	};

	PaypalGateway.prototype.generatePaymentId = function generatePaymentId() {};

	PaypalGateway.prototype.getWalletInfo = function getWalletInfo() {
		return new _promise2.default(function (resolve, reject) {
			return reject("Not implemented");
		});
	};

	PaypalGateway.prototype.createSubscription = function createSubscription(transactionInfo) {

		return new _promise2.default(function (resolve, reject) {
			console.log("Plan:", transactionInfo);
			// Create plan
			_Subscription.PayPalSubscription.createPlan({
				name: transactionInfo.name,
				description: transactionInfo.description,
				currency: transactionInfo.currency,
				amount: transactionInfo.amount,
				frequency_interval: transactionInfo.interval,
				frequency: transactionInfo.frequency,
				cancel_url: transactionInfo.cancelURL,
				return_url: transactionInfo.returnURL
			}).then(function (planDetails) {

				console.log("[PayPal] Plan Created:", planDetails.id);

				// Activate plan
				_Subscription.PayPalSubscription.activatePlan(planDetails.id).then(function (result) {
					console.log("[PayPal] Plan Activated:", planDetails.id);

					// Create agreement
					_Subscription.PayPalSubscription.createAgreement({
						planId: planDetails.id,
						name: transactionInfo.name,
						description: transactionInfo.description
					}).then(function (agreement) {
						console.log("[PayPal] Agreement created:", agreement.id);

						resolve(agreement);
					}).catch(function (error) {
						console.log("[PayPal] Paypal error:", error);
						return reject(error);
					});
				}).catch(function (error) {
					return reject(error);
				});
			}).catch(function (error) {

				return reject(error);
			});
		});
	};

	PaypalGateway.prototype.executeSubscription = function executeSubscription(transactionDetails) {
		return _Subscription.PayPalSubscription.executeAgreement(transactionDetails.token).then(function (result) {

			if (result.state == 'Active') {
				return {
					payer: result.payer,
					start_date: result.start_date,
					shipping_address: result.shipping_address,
					plan: result.plan
				};
			}
			return result;
		});
	};

	PaypalGateway.prototype.getSubscriptionStatus = function getSubscriptionStatus(transactionDetails) {};

	PaypalGateway.prototype.createIPNTransaction = function createIPNTransaction(transactionInfo) {};

	PaypalGateway.prototype.startPayment = function startPayment() {
		return new _promise2.default(function (success, reject) {
			return reject("Not implemented");
		});
	};

	PaypalGateway.prototype.checkPaymentStatus = function checkPaymentStatus() {
		return new _promise2.default(function (success, reject) {
			return reject("Not implemented");
		});
	};

	return PaypalGateway;
}();

exports.default = PaypalGateway;