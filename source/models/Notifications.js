import mongoose from "mongoose";

let schema = mongoose.Schema({

	// User receiving the notification
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},

	// Name of the notification
	name: {
		type: String,
	},

	// Type of the notification (Email, Webhook, Alert, SMS etc...)
	type: {
		type: String,
	},

	// Contents of the notification
	description: {
		type: String,
	},

	// Current status of the notification (Scheduled, Sent, Sending, Disabled)
	status: {
		type: String,
		enum: ['Scheduled', 'Sent', 'Sending', 'Disabled', 'Dismissed'],
		required: true,
		index: true, // Index it because we are searching for the notifications by their status
	},

	// Devices to send notifications to
	targets: [],

}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export default schema;