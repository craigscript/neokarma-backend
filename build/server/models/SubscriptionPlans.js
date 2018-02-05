'use strict';

exports.__esModule = true;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _mongoose2.default.Schema({

	// Subscription name
	name: {
		type: String,
		unique: true,
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

	trial: {
		type: Boolean,
		default: false
	},

	description: {
		type: String
	},

	features: [{
		label: String,
		enabled: Boolean
	}],

	quotas: [{
		used: Number,
		max: Number,
		name: String
	}],

	subscription: {
		period: {
			type: Number,
			default: 0
		},
		// Group this subscription extends
		group: {
			type: _mongoose2.default.Schema.Types.ObjectId,
			ref: 'UserGroup',
			required: true
		}
	}
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

exports.default = schema;