import mongoose from "mongoose";

let schema = mongoose.Schema({

	enabled: {
		type: Boolean,
		default: true,
	},
	
	// Target URL, search String etc..
	topic: {
		type: String,
		lowercase: true,
		required: true,
	},
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});
schema.connection = "twitter";
export default schema;