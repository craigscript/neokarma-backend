import mongoose from "mongoose";

let schema = mongoose.Schema({

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		unique: true,
		required: true,
	},

	// User Credentials
	email: {
		type: String,
		unique: true,
		required: true,
	},

	registration: {
		type: Boolean,
		default: true,
	},

	// Email expires
	expires: {
		type: Number,
		default: Date.now,
	},
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});


export default schema;