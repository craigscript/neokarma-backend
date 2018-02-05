"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SubscriptionService = Service(_class = function () {
	function SubscriptionService() {
		(0, _classCallCheck3.default)(this, SubscriptionService);
	}

	SubscriptionService.createSubscription = function createSubscription(userId, plan) {
		console.log("plan", plan);
		var subscription = plan.subscription;
		console.log("Changing user subscription to:", subscription);
		return User.update({
			_id: userId

		}, {
			group: subscription.group,
			subscription: {
				name: plan.name,
				expires: Date.now() + subscription.period,
				status: "Active"
			}
		}).exec();
	};

	return SubscriptionService;
}()) || _class;

;