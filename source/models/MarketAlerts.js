import mongoose from "mongoose";
let schema = mongoose.Schema({
	
	// Owner of the alert
	userId: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
	},

	// Name of the alert
	name: {
		type: String,
	},

	// MarketId to check for this alert
	exchange: {
		type: String,
		required: true,
		index: true,
	},

	// MarketId to check for this alert
	market: {
		type: String,
		required: true,
		index: true,
	},
	
	// Type of the alert
	alarmStrategy: {
		type: String,
		// Currently: PP => Price point, PC => Percent Change => MU => Market Update
		enum: ["pricepoint", "percentchange", "marketupdate"], 
		required: true,
	},

	// Additional parameters
	alarmOptions: {
		type: Object,
		default: {},
	},

	// Where to send the alert?
	target: {
		type: String,
		required: true,
	},

	// Where to send the alert?
	targetOptions: {
		type: Object,
		default: {},
	},
	
	// Counts how many alerts have been sent out so far
	count: {
		type: Number,
		default: 0,
	},

	// Last updated time for the alert (We check alerts every 5 minutes)
	lastUpdated: {
		type: Number,
		default: Date.now,
	},

	// The time for the last alert sent out
	lastAlert: {
		type: Number,
		default: Date.now,
	},

	canTrigger: {
		type: Boolean,
		default: true,
	},

	// Wether the alert is enabled / disabled
	enabled: {
		type: Boolean,
		default: true,
	},


},
{
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

export default schema;