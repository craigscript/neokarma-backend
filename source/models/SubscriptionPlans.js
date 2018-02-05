import mongoose from "mongoose";

let schema = mongoose.Schema({

	// Subscription name
	name: {
		type: String,
		unique: true,
		required: true,
	},

	price: {
		type: Number,
		required: true,
	},

	currency: {
		type: String,
		required: true,
	},

	trial: {
		type: Boolean,
		default: false,
	},

	description:{
		type: String,
	},

	features: [{
		label: String,
		enabled: Boolean,
	}],

	quotas: [{
		used: Number,
		max: Number,
		name: String,
	}],

	subscription: {
		period: {
			type: Number,
			default: 0,
		},	
		// Group this subscription extends
		group: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'UserGroup',
			required: true,
		},
	},
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export default schema;