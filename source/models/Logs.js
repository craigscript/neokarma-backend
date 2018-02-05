import mongoose from "mongoose";

let schema = mongoose.Schema({

	// User Credentials
	logType: {
		type: String,
		required: true,
	},

	logData: {
		type: Object
	},

	logDate: {
		type: Number,
		default: Date.now,
	},
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export default schema;