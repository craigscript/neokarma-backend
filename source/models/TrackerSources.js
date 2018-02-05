import mongoose from "mongoose";

let schema = mongoose.Schema({

	name: {
		type: String,
		required: true,
	},
	
	type: {
		type: String,
		required: true,
	},
	
	target: {
		type: Object,
		required: true,
	},

	options: {
		type: Object,
		
	},

	// Sources of the tracker to compare
	trackingSite: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'TrackingSites',
	},

	// Source of the tracking to compare
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	
	filters: [{
		// Source to compare with
		name: {
			type: Object,
			required: true,
		},
		// Target to compare with
		data: {
			type: Object,
		},
	}],

	actions: [{
		// Source to compare with
		name: {
			type: Object,
			required: true,
		},
		// Target to compare with
		data: {
			type: Object,
		},
	}],
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export default schema;