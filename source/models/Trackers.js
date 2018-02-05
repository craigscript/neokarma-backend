import mongoose from "mongoose";

let schema = mongoose.Schema({

	name: {
		type: String,
		required: true,
	},
	
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},

	// Sources of the tracker to compare
	sources: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'TrackerSources',
	}],
	
	exporters: [{
		// Source to compare with
		name: {
			type: Object,
			required: true,
		},
		// Target to compare with
		params: {
			type: Object,
		},
	}],

	global: {
		type: Boolean,
		default: false,
	},
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export default schema;