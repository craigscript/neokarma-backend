import mongoose from "mongoose";

let schema = mongoose.Schema({

	// Users requiring the tracking
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},

	// Tracking Method
	type: {
		type: String,
		enum: ["reddit", "website", "twitter", "facebook"],
	},
	
	status: {
		type: String,
		enum: ["Active", "Disabled"],
		default: "Active",
	},
	
	updated: {
		type: Number,
		default: Date.now,
	},

	// Target URL, search String etc..
	target: {
		type: String,
		lowercase: true,
		required: true,
	},
	options: {}
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export default schema;