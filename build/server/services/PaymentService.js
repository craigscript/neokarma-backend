"use strict";

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _class;

var _coinpayments = require("./PaymentGateways/coinpayments.js");

var _coinpayments2 = _interopRequireDefault(_coinpayments);

var _paypal = require("./PaymentGateways/paypal.js");

var _paypal2 = _interopRequireDefault(_paypal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PaymentGateways = {
	coinpayments: _coinpayments2.default,
	paypal: _paypal2.default
};
(0, _freeze2.default)(PaymentGateways);

var PaymentService = Service(_class = function () {
	function PaymentService() {
		(0, _classCallCheck3.default)(this, PaymentService);
	}

	PaymentService.CreateGateway = function CreateGateway(GatewayName) {
		try {
			if (!PaymentGateways[GatewayName]) return null;
			return new PaymentGateways[GatewayName]();
		} catch (error) {
			console.log("Error:", error);
			return null;
		}
	};

	PaymentService.getGateways = function getGateways() {
		var gateways = [];
		for (var gwName in PaymentGateways) {
			gateways.push(PaymentService.CreateGateway(gwName));
		}
		return gateways;
	};

	// static CRONUpdate()
	// {
	// 	UserPayment.find({
	// 		expires: {
	// 			$lt: Date.now(),
	// 		},
	// 		status: {
	// 			$ne: "InProgress",
	// 		}
	// 	}).then( payments => {
	// 		for(let payment of payments)
	// 		{
	// 			PaymentService.pollTransaction(payment.gateway, payment.transaction).then( result => {
	// 				if(result.paid)
	// 				{
	// 					payment.status = "Paid";
	// 					payment.paid = Date.now();
	// 					payment.save();	
	// 				}
	// 			});
	// 		}
	// 	});

	// 	UserPayment.remove({
	// 		expires: {
	// 			$gt: Date.now(),
	// 		},
	// 		status: {
	// 			$ne: "Paid",
	// 		}
	// 	});
	// }


	return PaymentService;
}()) || _class;

;

// setInterval( () => {
// 	PaymentService.CRONUpdate();
// }, 15000);