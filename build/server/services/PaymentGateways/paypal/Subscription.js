"use strict";

exports.__esModule = true;
exports.PayPalSubscription = undefined;

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var paypalSDK = require("paypal-rest-sdk");
var url = require("url");

var PayPalSubscription = exports.PayPalSubscription = function () {
	function PayPalSubscription() {
		(0, _classCallCheck3.default)(this, PayPalSubscription);
	}

	PayPalSubscription.createPlan = function createPlan(planDetails) {
		var billingPlan = {
			name: planDetails.name,
			description: planDetails.description,
			merchant_preferences: {
				auto_bill_amount: "YES",
				cancel_url: planDetails.cancel_url,
				initial_fail_amount_action: "continue",
				max_fail_attempts: "0",
				return_url: planDetails.return_url,
				setup_fee: {
					currency: planDetails.currency,
					value: planDetails.amount
				}
			},
			payment_definitions: [{
				amount: {
					currency: planDetails.currency,
					value: planDetails.amount
				},
				charge_models: [{
					amount: {
						currency: planDetails.currency,
						value: planDetails.amount
					},
					type: "SHIPPING"
				}],
				cycles: "0",
				frequency: planDetails.frequency,
				frequency_interval: planDetails.frequency_interval,
				name: planDetails.name,
				type: "REGULAR"
			}],
			type: "INFINITE"
		};

		return new _promise2.default(function (resolve, reject) {
			paypalSDK.billingPlan.create(billingPlan, function (error, billingPlan) {
				if (error) {
					return reject(error);
				}
				resolve(billingPlan);
			});
		});
	};

	PayPalSubscription.activatePlan = function activatePlan(planId) {
		return new _promise2.default(function (resolve, reject) {
			paypalSDK.billingPlan.update(planId, [{
				op: "replace",
				path: "/",
				value: {
					state: "ACTIVE"
				}
			}], function (error, response) {
				if (error) {
					return reject(error);
				}
				resolve(response);
			});
		});
	};

	PayPalSubscription.deactivatePlan = function deactivatePlan(planId) {
		return new _promise2.default(function (resolve, reject) {
			paypalSDK.billingPlan.update(planId, {
				"op": "replace",
				"path": "/",
				"value": {
					"state": "INACTIVE"
				}
			}, function (error, response) {
				if (error) {
					return reject(error);
				}
				resolve(response);
			});
		});
	};

	PayPalSubscription.createAgreement = function createAgreement(agreementDetails) {

		var isoDate = new Date();
		isoDate.setSeconds(isoDate.getSeconds() + 4);
		isoDate.toISOString().slice(0, 19) + 'Z';

		var billingAgreementAttributes = {
			name: agreementDetails.name,
			description: agreementDetails.description,
			start_date: isoDate,
			plan: {
				id: agreementDetails.planId
			},
			payer: {
				payment_method: "paypal"
			}
			// shipping_address: {
			// 	"line1": "StayBr111idge Suites",
			// 	"line2": "Cro12ok Street",
			// 	"city": "San Jose",
			// 	"state": "CA",
			// 	"postal_code": "95112",
			// 	"country_code": "US"
			// }
		};

		return new _promise2.default(function (resolve, reject) {
			paypalSDK.billingAgreement.create(billingAgreementAttributes, function (error, agreement) {
				if (error) {
					return reject(error);
				} else {

					var approval_url = agreement.links.find(function (link) {
						if (link.rel === 'approval_url') return true;
					}).href;

					//console.log("Created agreement:", agreement.links);
					var transaction = {
						id: agreement.id,
						method: "redirect",
						action_required: "approval",
						href: approval_url,
						token: url.parse(approval_url, true).query.token
					};

					return resolve(transaction);
				}
			});
		});
	};

	PayPalSubscription.executeAgreement = function executeAgreement(paymentToken) {
		console.log("[PayPal] executeAgreement paymentToken:", paymentToken);
		return new _promise2.default(function (resolve, reject) {
			paypalSDK.billingAgreement.execute(paymentToken, {}, function (error, agreement) {
				if (error) {
					return reject(error);
				}

				resolve(agreement);
			});
		});
	};

	return PayPalSubscription;
}();

;