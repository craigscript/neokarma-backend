import mongoose from "mongoose";

let schema = mongoose.Schema({

	// Tracking Method
	type: {
		type: String,
	},
	
	updates: [Date],

	stats: {
		type: Number,
	},

	// Target URL, search String etc..
	target: {
		type: String,
		lowercase: true,
		required: true,
	},
	

}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export default schema;