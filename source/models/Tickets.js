import mongoose from "mongoose";

let schema = mongoose.Schema({

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},

	subject: {
		type: String,
	},

	category: {
		type: String,
	},
	
	status: {
		type: String,
		enum: ["Open", "Closed", "Resolved"],
		default: "Open",
	},

	messages: [{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		message: String,
		date: {
			type: Number,
			default: Date.now,
		}
	}],
	
	created: {
		type: Number,
		default: Date.now,
	},

	updated: {
		type: Number,
		default: Date.now,
	},

	notification: {
		type: Boolean,
		default: false,
	}
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export default schema;