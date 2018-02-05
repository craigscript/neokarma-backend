import mongoose from "mongoose";
let schema = mongoose.Schema({

	// User who received this mention
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},

	tracker: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'MentionTrackings',
	},
	
	// Name of the tracking
	name: String,

	// The keyword this mention was about
	keywords: [String],
	
	// Page Title # Source Name
	title: String,

	// Sentiment analysis on mention
	sentiment: Object,

	// Context of the mention
	content: [String],

	// href url for the mention
	url: String,
	
	// Recording date
	date: Number,
	
	type: {
		type: String,
		required: true,
	},
	categories: [String],
}, {
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});
schema.index({date: -1});
export default schema;