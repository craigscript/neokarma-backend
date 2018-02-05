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

	updates: [Date],

	stats: {
		type: Number
	},

	// Target URL, search String etc..
	target: {
		type: String,
		lowercase: true,
		required: true
	}

}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

exports.default = schema;