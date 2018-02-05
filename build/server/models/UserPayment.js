"use strict";

exports.__esModule = true;

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _mongoose2.default.Schema({

	paymentToken: {
		type: String,
		required: true,
		select: false,
		unique: true
	},

	// User Credentials
	user: {
		type: _mongoose2.default.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},

	name: {
		type: String,
		required: true
	},

	price: {
		type: Number,
		required: true
	},

	currency: {
		type: String,
		required: true
	},

	status: {
		type: String,
		enum: ["Unpaid", "InProgress", "Paid", "Pending", "Failed"]
	},

	gateway: {
		type: String,
		required: true
	},

	transaction: {
		type: Object
	},

	// Subscription plan the user received when the payment completed
	plan: {
		type: Object,
		required: true
	},

	created: {
		type: Number,
		required: true,
		default: Date.now
	},

	paid: {
		type: Number,
		required: true,
		default: -1
	},

	expires: {
		type: Number,
		required: true,
		default: Date.now
	}
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

schema.methods.toJSON = function () {
	var obj = this.toObject();
	delete obj.paymentToken;
	return obj;
};

exports.default = schema;