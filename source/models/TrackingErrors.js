import mongoose from "mongoose";

let schema = mongoose.Schema({

	// Tracking Method
	type: {
		type: String,
	},
	
	createdAt: {
		type: Number,
		default: Date.now,
	},

	errorLevel: {
		type: Number,
		default: 0,
	},

	// Target URL, search String etc..
	target: {
		type: String,
		lowercase: true,
		required: true,
	},

	error: {
		type: String,
	},
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export default schema;