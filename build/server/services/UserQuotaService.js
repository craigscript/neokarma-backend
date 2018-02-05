"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserQuota = Service(_class = function () {
	function UserQuota() {
		(0, _classCallCheck3.default)(this, UserQuota);
	}

	UserQuota.validate = function validate(user, entryType, amount) {
		var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

		var quota = UserQuota.getQuota(user, entryType);
		if (max <= 0) {
			max = quota.max;
		}
		return Math.max(quota.used + amount, 0) <= max;
	};

	UserQuota.validateCustom = function validateCustom(user, entryType, amount) {
		var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

		var quota = UserQuota.getQuota(user, entryType);
		if (max <= 0) {
			max = quota.max;
		}
		return Math.max(amount, 0) <= max;
	};

	UserQuota.getQuota = function getQuota(user, entryType) {
		if (!user.quotas) return { used: 0, max: 0, name: entryType };

		var quota = user.quotas.find(function (item) {
			if (item.name == entryType) {
				return item;
			}
		});
		if (!quota) return { used: 0, max: 0, name: entryType };
		return quota;
	};

	UserQuota.update = function update(user, entryType, amount) {
		var quota = UserQuota.getQuota(user, entryType);
		console.log("Quota:", quota);
		if (quota.used + amount <= quota.max) {
			quota.used = Math.max(quota.used + amount, 0);
			console.log("user quotas:", user.quotas);

			UserQuota.saveQuotas(user);
			return true;
		}
		return false;
	};

	UserQuota.setQuota = function setQuota(user, entryType, used, max) {
		// If no quotas for the user generate it
		if (!user.quotas) {
			return UserQuota.generateQuota(user, entryType, used, max);
		}

		// Find quota entry
		var quota = user.quotas.find(function (item) {
			if (item.name == entryType) {
				return item;
			}
		});

		if (!quota) {
			return UserQuota.generateQuota(user, entryType, used, max);
		}

		quota.used = used;
		quota.max = max;

		// Save		
		UserQuota.saveQuotas(user);
		return true;
	};

	UserQuota.generateQuota = function generateQuota(user, entryType, used, max) {
		var quota = { used: used, max: max, name: entryType };
		user.quotas.push(quota);
		UserQuota.saveQuotas(user);
		return true;
	};

	UserQuota.saveQuotas = function saveQuotas(user) {
		User.update({
			_id: user._id
		}, {
			quotas: user.quotas
		}).exec();
	};

	return UserQuota;
}()) || _class;

;