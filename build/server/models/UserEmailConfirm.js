'use strict';

exports.__esModule = true;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _mongoose2.default.Schema({

	user: {
		type: _mongoose2.default.Schema.Types.ObjectId,
		ref: 'User',
		unique: true,
		required: true
	},

	// User Credentials
	email: {
		type: String,
		unique: true,
		required: true
	},

	registration: {
		type: Boolean,
		default: true
	},

	// Email expires
	expires: {
		type: Number,
		default: Date.now
	}
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

exports.default = schema;