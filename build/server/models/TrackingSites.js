"use strict";

exports.__esModule = true;

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _mongoose2.default.Schema({

	// Users requiring the tracking
	user: {
		type: _mongoose2.default.Schema.Types.ObjectId,
		ref: 'User'
	},

	// Tracking Method
	type: {
		type: String,
		enum: ["reddit", "website", "twitter", "facebook"]
	},

	status: {
		type: String,
		enum: ["Active", "Disabled"],
		default: "Active"
	},

	updated: {
		type: Number,
		default: Date.now
	},

	// Target URL, search String etc..
	target: {
		type: String,
		lowercase: true,
		required: true
	},
	options: {}
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

exports.default = schema;