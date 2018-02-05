'use strict';

exports.__esModule = true;
exports.default = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Coinpayments = require('coinpayments');
var crypto = require('crypto');
var qs = require('querystring');

var CointPaymentGateway = function () {
	function CointPaymentGateway() {
		(0, _classCallCheck3.default)(this, CointPaymentGateway);

		this.Gateway = new Coinpayments(Config.cointpayments.options);
	}

	CointPaymentGateway.prototype.getPaymentMethods = function getPaymentMethods() {
		return [{
			name: "Bitcoin",
			currencies: ["BTC"],
			gateway: "coinpayment"
		}, {
			name: "Ethereum",
			currencies: ["ETH"],
			gateway: "coinpayment"
		}];
	};

	CointPaymentGateway.prototype.generatePaymentId = function generatePaymentId() {};

	CointPaymentGateway.prototype.getWalletInfo = function getWalletInfo() {
		var _this = this;

		return new _promise2.default(function (resolve, reject) {
			_this.Gateway.getBasicInfo(function (error, info) {
				if (error || !info) {
					return reject(error);
				}

				resolve(info);
			});
		});
	};

	CointPaymentGateway.prototype.createIPNTransaction = function createIPNTransaction(transactionInfo) {
		var _this2 = this;

		var options = {
			currency1: transactionInfo.currency,
			currency2: transactionInfo.targetCurrency,
			amount: transactionInfo.amount,
			ipn_url: transactionInfo.ipnURL
		};
		console.log("Creating IPN:", options);
		return new _promise2.default(function (resolve, reject) {
			if (Config.cointpayments.currencies.indexOf(transactionInfo.targetCurrency) < 0) return reject("Invalid currency:" + transactionInfo.targetCurrency);
			_this2.Gateway.createTransaction(options, function (error, transaction) {

				if (error || !transaction) {
					return reject(error);
				}

				return resolve(transaction);
			});
		});
	};

	CointPaymentGateway.prototype.startPayment = function startPayment() {
		return new _promise2.default(function (success) {});
	};

	CointPaymentGateway.prototype.checkPaymentStatus = function checkPaymentStatus() {};

	CointPaymentGateway.prototype.validateHMAC = function validateHMAC(parameters, secret) {
		var signature = void 0,
		    paramString = void 0;
		paramString = qs.stringify(parameters).replace(/%20/g, '+');
		signature = crypto.createHmac('sha512', secret).update(paramString).digest('hex');
		return signature;
	};

	CointPaymentGateway.prototype.handleIPN = function handleIPN(req, res) {
		var _this3 = this;

		return new _promise2.default(function (resolve, reject) {

			if (!req.get('HMAC') || !req.body || !req.body.ipn_mode || req.body.ipn_mode != 'hmac' || Config.cointpayments.MerchantId != req.body.merchant) {
				return resolve({ success: false, message: "invalid request." });
			}

			var hmac = _this3.validateHMAC(req.body, Config.cointpayments.IPNSecret);
			if (hmac != req.get('HMAC')) {
				return resolve({ success: false, message: "invalid request." });
			}
			if (req.body.status < 0) {
				return resolve({ success: false, failed: true, message: "Transaction failed." });
			}
			if (req.body.status < 100) {
				return resolve({ success: false, pending: true, message: "pending." });
			}
			if (req.body.status == 100) {
				return resolve({ success: true });
			}
			return resolve({ success: false, message: "unkown request." });
		});
	};

	return CointPaymentGateway;
}();

exports.default = CointPaymentGateway;