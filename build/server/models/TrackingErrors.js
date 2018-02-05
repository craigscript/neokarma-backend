'use strict';

exports.__esModule = true;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _mongoose2.default.Schema({

	// Tracking Method
	type: {
		type: String
	},

	createdAt: {
		type: Number,
		default: Date.now
	},

	errorLevel: {
		type: Number,
		default: 0
	},

	// Target URL, search String etc..
	target: {
		type: String,
		lowercase: true,
		required: true
	},

	error: {
		type: String
	}
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

exports.default = schema;