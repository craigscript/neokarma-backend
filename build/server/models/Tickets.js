"use strict";

exports.__esModule = true;

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _mongoose2.default.Schema({

	user: {
		type: _mongoose2.default.Schema.Types.ObjectId,
		ref: 'User'
	},

	subject: {
		type: String
	},

	category: {
		type: String
	},

	status: {
		type: String,
		enum: ["Open", "Closed", "Resolved"],
		default: "Open"
	},

	messages: [{
		user: {
			type: _mongoose2.default.Schema.Types.ObjectId,
			ref: 'User'
		},
		message: String,
		date: {
			type: Number,
			default: Date.now
		}
	}],

	created: {
		type: Number,
		default: Date.now
	},

	updated: {
		type: Number,
		default: Date.now
	},

	notification: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

exports.default = schema;