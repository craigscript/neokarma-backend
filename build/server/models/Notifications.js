'use strict';

exports.__esModule = true;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _mongoose2.default.Schema({

	// User receiving the notification
	user: {
		type: _mongoose2.default.Schema.Types.ObjectId,
		ref: 'User'
	},

	// Name of the notification
	name: {
		type: String
	},

	// Type of the notification (Email, Webhook, Alert, SMS etc...)
	type: {
		type: String
	},

	// Contents of the notification
	description: {
		type: String
	},

	// Current status of the notification (Scheduled, Sent, Sending, Disabled)
	status: {
		type: String,
		enum: ['Scheduled', 'Sent', 'Sending', 'Disabled', 'Dismissed'],
		required: true,
		index: true // Index it because we are searching for the notifications by their status
	},

	// Devices to send notifications to
	targets: []

}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

exports.default = schema;