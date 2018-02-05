'use strict';

exports.__esModule = true;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _mongoose2.default.Schema({
	name: {
		type: String,
		unique: true,
		required: true
	},

	acl: [],

	groupType: {
		type: String,
		enum: ['user', 'support', 'customer', 'admin', 'developer', 'guest'],
		required: true
	},

	allowRegistration: {
		type: Boolean,
		default: false
	},

	comment: {
		type: String
	}
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

exports.default = schema;